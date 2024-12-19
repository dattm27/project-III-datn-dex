
import { useEffect } from "react";
import { useReadContract, useBlockNumber } from "wagmi";
import { ERC20_ABI } from "../abis";
import {Address} from 'viem';


export const useCheckAllowance = ({
    tokenAddress,
    ownerAddress,
    spenderAddress,
    autoRefetch = false,
}: AllowanceProps & { autoRefetch?: boolean }) => {
    const { data, isLoading, error, refetch } = useReadContract({
        address: tokenAddress as Address,
        abi: ERC20_ABI, 
        functionName: 'allowance',
        args: [ownerAddress, spenderAddress],
    });

    const { data: blockNumber } = useBlockNumber({ watch: autoRefetch });
    useEffect(() => {
        if (autoRefetch && blockNumber) {
            refetch();
        }
    }, [autoRefetch, blockNumber, refetch]); 

    console.log('account', ownerAddress, 'token', tokenAddress, 'spender:', spenderAddress, 'amount',data);
    return { data, isLoading, error };
};


export const useCheckBalance = ({
    tokenAddress,
    accountAddress
}: BalanceProps) => {
    const {data, isLoading, error , refetch}  = useReadContract ({
        address: tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [accountAddress],
    })

    const {data: blockNumber} = useBlockNumber({watch: true});
    useEffect (()=>{
        if(blockNumber){
            refetch();
        }
    }, [blockNumber])
    return {data, isLoading, error};
}