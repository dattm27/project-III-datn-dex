import React from 'react';
import { useCheckAllowance } from 'src/web3/ERC20Token/readContract';

export const Allowance: React.FC<AllowanceProps> = ({
    tokenAddress,
    ownerAddress,
    spenderAddress
}) => {
    const {  data, isLoading, error } = useCheckAllowance({ tokenAddress, ownerAddress, spenderAddress });

    if (isLoading) {
        return <p>Loading allowance...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return <p> ${data?.toString()} </p>
}

