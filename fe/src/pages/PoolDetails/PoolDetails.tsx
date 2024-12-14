import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Card, Typography, Row, Col, Breadcrumb, Skeleton } from 'antd';
import { DotChartOutlined } from '@ant-design/icons';
import { SwapButton } from './SwapButton';
import { formatUnits } from 'ethers';
import { PATHS } from 'src/routes';
import { getPoolDetails } from 'src/services';
const { Text, Title } = Typography;
import { getTransactionHistory } from 'src/services';
import TransactionHistoryTable from './TransactionHistoryTable';
import { PoolChart } from './PoolChart';
export const PoolDetails: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const [pool, setPool] = useState<Pool|null>(null);
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState<Error | null>(null); // State for error
  const [transactionHistories, setTransactionHistories] = useState<TransactionHistory[]>([]);
  const [total, setTotal] = useState(0); // Tổng số giao dịch
  const [page, setPage] = useState(1); // Trang hiện tại


  const fetchTransactionHistory = async (currentPage: number) => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * 20;
      const limit = 20;
      const transactions = await getTransactionHistory(poolId!, { offset, limit });
      setTransactionHistories(transactions);
      // Giả định subgraph có API trả về tổng số giao dịch
      setTotal(100); // Thay bằng số thực từ backend
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory(page);
  }, [page]);

  
  useEffect(() => {
  }, [poolId]);

  useEffect (() => { 
    const exec = async () => {
      try {
       // setLoading(true)
        const pool = await getPoolDetails(poolId!);
        setPool(pool);
      } catch (error){
        setError(error instanceof Error ? error : new Error("Error loading pool details"));
      } finally {
        setLoading(false);
      }
     
    };
    exec();
    const interval = setInterval(exec, 1000 * 60 * 2);
    return () => clearInterval(interval);
  }, [poolId])

  // if (loading) {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }
  if (error) return <p>Error: {error.message}</p>;
  if (pool != null)
  {
    return (
      <div >
        <Breadcrumb style={{ marginBottom: '20px' }}>
          <Breadcrumb.Item>
            <Link to={PATHS.EXPLORE}>Explore</Link>
            
          </Breadcrumb.Item>
          <Breadcrumb.Item>
          <Link to={PATHS.EXPLORE}>Pools</Link>
  
          </Breadcrumb.Item>
          <Breadcrumb.Item>{poolId}</Breadcrumb.Item>
        </Breadcrumb>
  
        <Title level={1}>
          {pool?.token0.symbol}/{pool?.token1.symbol}: Buy and Sell
        </Title>
  
        <Row gutter={16}>
          {/* Cột 1 - Skeleton cho Chart và Bảng Lịch sử Giao dịch */}
          <Col span={16}>
            <Card title="Price History" bordered={false}>
              <Skeleton active loading={loading} paragraph={{ rows: 8 }} />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                {/* <DotChartOutlined
                  style={{
                    fontSize: 300,  // Bạn có thể điều chỉnh kích thước biểu đồ tùy ý
                    color: '#bfbfbf',
                  }}
                /> */}
                 
              </div>
              <PoolChart poolId={poolId!} blockTimestamp={0}/>
            </Card>
  
            <Card title="Transaction History" bordered={false} style={{ marginTop: '20px' }}>
              {/* <Skeleton active loading={loading} paragraph={{ rows: 8 }} /> */}
              <TransactionHistoryTable
                pool={pool}
                transactionHistories={transactionHistories}
                total={total}
                page={page}
                onPageChange={setPage}
                loading={loading}
              />
            </Card>
          </Col>
  
          <Col span={8}>
            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="primary"
                  onClick={() => navigate(`/add-liquidity/${poolId}`, {
                    state: {
                      token0: pool?.token0,
                      token1: pool?.token1,
                      pool: pool
                    },
                  })}
                  size="large"
                  block
                >
                  + Add Liquidity
                </Button>
              </Col>
              <Col span={12}>
              <SwapButton 
                poolId={poolId!} 
                token0 = {pool.token0}
                token1 = {pool.token1}
                />
              </Col>
            </Row>
  
            <Card title="Pool Stats" bordered={false} style={{ marginTop: '20px' }}>
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <>
                   <Title level={4}>Pool Balances</Title>
                   <Text type="success">{formatUnits(pool?.reserve0 ||"0") } {pool?.token0.symbol}</Text> / 
                   <Text type="danger"> {formatUnits(pool?.reserve1 || "0")} {pool?.token1.symbol}</Text>
                  
                  <Title level={4}>Total Volume Locked</Title>
                  <p>${(parseFloat(pool?.reserve0 || '0') + parseFloat(pool?.reserve1 || '0')).toFixed(2)}</p>
                  <Title level={4}>24H Volume</Title>
                  <p>24H Volume: {/* Bạn có thể thay thế bằng dữ liệu Volume ở đây */}</p>
                  <Title level={4}>24H Fees</Title>
                  <p>24H Fees: {/* Bạn có thể thay thế bằng dữ liệu Fees ở đây */}</p>
                </>
              )}
            </Card>
          </Col>
        </Row>
      
      </div>
    );
  }
 
};
