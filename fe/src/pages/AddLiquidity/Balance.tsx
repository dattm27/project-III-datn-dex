import React from 'react';
import { useCheckBalance } from 'src/web3/ERC20Token/readContract';

export const Balance: React.FC<BalanceProps> = ({
    tokenAddress,
    accountAddress
}) => {
    const {data, isLoading, error} = useCheckBalance({tokenAddress, accountAddress});
    if (isLoading) {
        return <p>Loading Balance</p>
    }
    if (error){
        return <p>Error: {error.message}</p>
    }
    return <p>{data?.toString()}</p>
}