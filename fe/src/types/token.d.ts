declare interface Token {
  id: string;
  name: string;
  symbol: string;
  decimals: number;

}

declare interface AllowanceProps {
  tokenAddress: string;
  ownerAddress: string;
  spenderAddress: string;
}


declare interface BalanceProps {
  tokenAddress: string;
  accountAddress: string;
}


declare interface PoolReserve {
  blockTimestamp: number;
  reserve0: number;
  reserve1: number;
}