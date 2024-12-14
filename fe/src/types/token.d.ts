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


