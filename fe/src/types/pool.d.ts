declare interface Pool {
    id: string;
    token0: Token;
    token1: Token;
    pair: string;
    reserve0: string; 
    reserve1: string;
    tvl?: string;
    volume24h?: string;
    fee24h?: string;
  }


declare interface TransactionHistory {
  id: string;
  type: string;
  sender: string;
  mint?: {
    amount0: string;
    amount1: string;
  };
  swap?: {
    amount0In: string;
    amount0Out: string;
    amount1In: string;
    amount1Out: string;
  };
  burn?: {
    amount0: string;
    amount1: string;
  };
  blockNumber: string;
  timestamp: string;
}

