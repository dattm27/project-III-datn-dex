import request, { gql } from "graphql-request";
import { API_URL_SUB_GRAPH } from "src/constants";

export type PageAble = {
  offset: number;
  limit: number;
};

const endpoint = API_URL_SUB_GRAPH;
export async function getTokens(): Promise<Token[]> {
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
    const res = await request<{ tokens: Token[] }>(endpoint, query);
    return res.tokens;
}

export async function getPools(): Promise<Pool[]> {
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
    const res = await request<{ pools: Pool[] }>(endpoint, query);
    return res.pools;
}

export async function getPoolDetails(id: string): Promise<Pool> {
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
    `
    const res = await request<{ pool: Pool }>(endpoint, query);
    return res.pool;
}

export async function getTransactionHistory(
  pool: string,
  {offset, limit}: PageAble = {offset : 0, limit : 20}
): Promise<TransactionHistory []>{
  const query = gql`{
    transactions(where: { pool: "${pool}" }, first: ${limit}, skip: ${offset}
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
  }`
  const res = await request<{transactions: TransactionHistory []}>(endpoint, query);
  return res.transactions;
}