import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

interface Token {
  name: string;
  symbol: string;
}

interface Pool {
  id: string;
  token0: Token;
  token1: Token;
  pair: string;
}

const PoolList: React.FC = () => {
  const { loading, error, data } = useQuery<{ pools: Pool[] }>(GET_POOLS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Pools</h2>
      <ul>
        {data?.pools.map((pool) => (
          <li key={pool.id}>
            <p>Pair: {pool.pair}</p>
            <p>Token 0: {pool.token0.name} ({pool.token0.symbol})</p>
            <p>Token 1: {pool.token1.name} ({pool.token1.symbol})</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PoolList;
