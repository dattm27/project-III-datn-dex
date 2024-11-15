declare interface Pool {
    id: string;
    token0: Token;
    token1: Token;
    pair: string;
    reserve0?: string; 
    reserve1?: string;
    tvl?: string;
    volume24h?: string;
    fee24h?: string;
  }