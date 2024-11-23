import { Account, WalletOptions } from "../Layout";
import {  useAccount } from 'wagmi'
export function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}