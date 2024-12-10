import request, { gql } from "graphql-request";
import { API_URL_SUB_GRAPH } from "src/constants";

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
            name
            symbol
          }
          token1 {
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