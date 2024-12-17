import { gql } from "graphql-request";
import { API_URL_SUB_GRAPH } from "src/constants";

export type PageAble = {
  offset: number;
  limit: number;
};

export const endpoint = API_URL_SUB_GRAPH;

// Trả về query và hàm để parse kết quả cho các tokens
export function getTokensQuery():  string {
  const query = gql`
    {
      tokens {
        decimals
        id
        name
        symbol
      }
    }
  `;
  return query ;
}

// Trả về query và hàm để parse kết quả cho các pools
export function getPoolsQuery():   string  {
  const query = gql`
    {
      pools {
        id
        token0 {
          id
          name
          symbol
        }
        token1 {
          id
          name
          symbol
        }
        reserve0
        reserve1
      }
    }
  `;
  return  query ;
}

// Trả về query và hàm để parse kết quả cho chi tiết pool
export function getPoolDetailsQuery(id: string): string  {
  const query = gql`
    {
      pool(id: "${id}") {
        id
        token0 {
          id
          name
          symbol
          decimals
        }
        token1 {
          id
          name
          symbol
          decimals
        }
        reserve0
        reserve1
      }
    }
  `;
  return query ;
}

// Trả về query và hàm để parse lịch sử giao dịch của pool
export function getTransactionHistoryQuery(
  pool: string,
  { offset, limit }: PageAble = { offset: 0, limit: 20 }
): { query: string } {
  const query = gql`
    {
      transactions(
        where: { pool: "${pool}" }
        first: ${limit}
        skip: ${offset}
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        type
        sender
        mint {
          amount0
          amount1
        }
        swap {
          amount0In
          amount0Out
          amount1In
          amount1Out
        }
        burn {
          amount0
          amount1
        }
        blockNumber
        timestamp
      }
    }
  `;
  return { query };
}

// Trả về query và hàm để parse lịch sử giá của pool
export function getPoolPriceHistoryQuery(
  poolId: string,
  blockTimestamp: string
): { query: string } {
  const query = gql`
    {
      pool(id: "${poolId}") {
        priceHistory(
          where: { blockTimestamp_gte: ${blockTimestamp} }
          orderBy: blockTimestamp
          orderDirection: desc
        ) {
          blockTimestamp
          reserve0
          reserve1
        }
      }
    }
  `;
  return { query };
}
