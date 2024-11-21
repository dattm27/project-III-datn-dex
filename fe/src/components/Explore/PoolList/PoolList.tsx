import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'src/routes';
const GET_POOLS = gql`
  query {
    pools {
      id
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
      pair
    }
  }
`;

// get pool's data 



export const PoolList: React.FC = () => {
  const { loading, error, data } = useQuery<{ pools: Pool[] }>(GET_POOLS);
  const navigate = useNavigate();

  const handleRowClick = (poolId: string) => {
    const path = PATHS.EXPLORE_POOL.replace(':poolId', poolId); 
    navigate(path); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Pools</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>#</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Pool</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>TVL (USD)</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>APR (%)</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>1D Vol (USD)</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>30D Vol (USD)</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>1D Vol / TVL</th>
          </tr>
        </thead>
        <tbody>
          {data?.pools.map((pool, index) => (
            <tr
              key={pool.id}
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer', // Thêm con trỏ tay khi hover
              }}
              onClick={() => handleRowClick(pool.id)} // Xử lý khi bấm vào hàng
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f8ff')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                {pool.token0.symbol} / {pool.token1.symbol}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>$0</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>N/A</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>N/A</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>N/A</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>N/A</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
