import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPoolPriceHistory } from 'src/services'; // Thay bằng API thật của bạn

interface PoolChartProps {
  poolId: string;
  blockTimestamp: number;
}

export const PoolChart: React.FC<PoolChartProps> = ({ poolId, blockTimestamp }) => {
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        const data = await getPoolPriceHistory(poolId.toString(), blockTimestamp.toString());
        const formattedData = data
          .map((entry: any) => {
            const reserve0 = Number(entry.reserve0);
            const reserve1 = Number(entry.reserve1);
            return {
              time: new Date(Number(entry.blockTimestamp) * 1000)
                .toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  hour12: false, // Hiển thị giờ 24h
                })
                .replace(', 00', ''), // Loại bỏ phút
              price: reserve0 > 0 ? reserve1 / reserve0 : 0, // Tính giá token0
            };
          })
          .reverse(); // Đảo ngược dữ liệu để ngày mới nhất ở bên phải
        setPriceHistory(formattedData);
      } catch (err) {
        setError('Failed to fetch price history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [poolId, blockTimestamp]);

  if (loading) {
    return <div>Loading price history...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Token0 Price History</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={priceHistory} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            domain={['auto', 'auto']} // Để trục Y tự động scale theo dữ liệu
            tickFormatter={(value) => value.toFixed(6)} // Hiển thị giá trị với 6 chữ số thập phân
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { time, price } = payload[0].payload;
              return (
                <div style={{ padding: '8px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
                  <strong>Time: </strong>{time}<br />
                  <strong>Token0 Price: </strong>{price?.toFixed(6)}<br />
                </div>
              );
            }}
          />
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

