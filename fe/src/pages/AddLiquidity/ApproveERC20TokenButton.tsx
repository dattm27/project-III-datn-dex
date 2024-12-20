import { parseUnits } from "ethers";
import React, { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button, message } from "antd";
import { ERC20_ABI } from "src/web3/abis";
import { Address } from 'viem';
import { useFetchGql } from "src/hooks/useFetch";
import { getTokenDetailQuery } from "src/services/pools/pool_gql";

interface ApproveERC20ButtonProps {
    tokenAddress: string;
    spenderAddress: string;
    amount: string;
  
}

export const ApproveERC20Button: React.FC<ApproveERC20ButtonProps> = ({
    tokenAddress,
    spenderAddress,
    amount,
    
}) => {

    const { data: hash, isPending, writeContract } = useWriteContract();
    async function approve(){
        
        try {
           
            writeContract({
                abi: ERC20_ABI,
                address: tokenAddress as Address,
                functionName: "approve",
                args: [spenderAddress, parseUnits(amount || "0")]
            })
        }
        catch (error) {
            console.log(error);
        }
    }
  
    const { isLoading, isError } =
        useWaitForTransactionReceipt({
            hash,
        });

    // Xử lý các thông báo lỗi
    useEffect(() => {
     
        if (isError) {
            message.error("Transaction failed: ");
        }
    }, [isError]);

    const {data: tokenData} = useFetchGql<{token: Token}>(getTokenDetailQuery(tokenAddress));
    const token = tokenData?.token;
    return (
        <div>
            {token && <Button
                type="primary"
                size="large"
                block
                loading={ isPending}
                onClick={() => approve()}
            >
                {isLoading ? `Approving ${token!.symbol}...` : `Approve ${token!.symbol}`}
            </Button>
            }
        </div>
    );
};
