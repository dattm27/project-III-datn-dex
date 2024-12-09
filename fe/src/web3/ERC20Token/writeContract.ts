import {Address} from 'viem';
import { ERC20_ABI } from "../abis";
import { parseUnits} from 'ethers';
import {useWriteContract, useWaitForTransactionReceipt} from 'wagmi';

export const useTokenApprove = ({
    tokenAddress,
    spenderAddress,
    amount,
  }: {
    tokenAddress: string;
    spenderAddress: string;
    amount: string;
  }) => {
    const { data: hash, isPending, writeContract} = useWriteContract();
    const approve  =({
      abi: ERC20_ABI,
      address: tokenAddress as Address,
      functionName: "approve",
      args: [spenderAddress, parseUnits(amount || "0")]
    })
    const { isLoading: isConfirming, isSuccess: isConfirmed , isError: isApproveFailed} =
    useWaitForTransactionReceipt({
      hash,
    });

    return {hash, isPending, isConfirming, isConfirmed, isApproveFailed, approve }

  };