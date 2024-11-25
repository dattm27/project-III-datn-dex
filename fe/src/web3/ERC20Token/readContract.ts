
import { useEffect } from "react";
import { useReadContract, useBlockNumber } from "wagmi";
import { ERC20_ABI } from "../abis";
import {Address} from 'viem';


export const useCheckAllowance = ({
    tokenAddress,
    ownerAddress,
    spenderAddress,
}: AllowanceProps) => {
   
    const {data, isLoading, error, refetch} = useReadContract({
        address: tokenAddress as Address,
        abi: ERC20_ABI, 
        functionName: 'allowance',
        args: [ownerAddress, spenderAddress],
      
         
    });

    const { data: blockNumber } = useBlockNumber({ watch: true })
    useEffect(() => {
        // want to refetch every `n` block instead? use the modulo operator!
        // if (blockNumber % 5 === 0) refetch() // refetch every 5 blocks
        refetch();
      }, [blockNumber])
    return {  data, isLoading, error};
};