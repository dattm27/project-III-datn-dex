import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_POOL_DETAIL = gql`
  query GetPool($id: String!) {
    pool(id: $id) {
      id
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
      # pair
      # reserve0
      # reserve1
      # tvl
      # volume24h
      # fee24h
    }
  }
`;

export const PoolDetails: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const { loading, error, data } = useQuery<{ pool: Pool }>(GET_POOL_DETAIL, {
    variables: { id: poolId },
  });

  useEffect(() => {
    if (data?.pool) {
      document.title = `${data.pool.token0.symbol}/${data.pool.token1.symbol}: Buy and Sell`;
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Thêm kiểm tra trước khi sử dụng data
  if (!data || !data.pool) {
    return <p>No pool data available.</p>;
  }

  const pool = data.pool;
  const reserve0 = pool.reserve0 || '0';
  const reserve1 = pool.reserve1 || '0';
  const tvl = pool.tvl || '$0';
  const volume24h = pool.volume24h || '$0';
  const fee24h = pool.fee24h || '$0';

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <span>Explore &gt; Pools &gt; {poolId}</span>
      </div>

      {/* Title */}
      <h1>
        {pool.token0.symbol}/{pool.token1.symbol}: Buy and Sell
      </h1>

      {/* Balances */}
      <div>
        <p>Pool balances:</p>
        <ul>
          <li>
            {pool.token0.symbol}:  {reserve0}
          </li>
          <li>
            {pool.token1.symbol}: {reserve1}
          </li>
        </ul>
      </div>

      {/* TVL / Volume / Fee */}
      <div style={{ marginTop: '20px' }}>
        <h3>Stats</h3>
        <ul>
          <li>TVL:  {tvl}</li>
          <li>24H Volume:  {volume24h}</li>
          <li>24H Fee: {fee24h}</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          + Add Liquidity
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span style={{ marginRight: '5px' }}>↔</span> Swap
        </button>
      </div>
    </div>
  );
};
