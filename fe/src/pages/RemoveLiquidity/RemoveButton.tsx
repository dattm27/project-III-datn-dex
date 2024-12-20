import { Button, Alert, Typography } from "antd";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { POOL_ABI } from "src/web3/abis";
import { Address } from 'viem';
import { EXPLORER_BASE_URL } from "src/constants";
const { Text } = Typography;
interface RemoveButtonnProps {
    poolId: string;
    shares: string
}

const RemoveButtonn: React.FC<RemoveButtonnProps> = ({ poolId, shares }) => {
    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    async function removeLiquidity() {
        try {
            writeContract({
                abi: POOL_ABI,
                address: poolId as Address,
                functionName: 'removeLiquidity',
                args: [Number(shares)]
            })
        } catch (error) {
            console.error('Remove liquidity failed: ', error);
        }
    }
    return (
        <div>
            <Button type="primary"
                style={{ width: "100%", marginTop: 20 }}
                onClick={() => removeLiquidity()}
                disabled={parseInt(shares) == 0}
                loading={isPending}
            >
                {isPending ? 'Confirming' : 'Remove Liquidity'}</Button>
            {hash && (
                <Alert
                    type="info"
                    message={
                        <>
                            Transaction Hash: <Text copyable>{hash}</Text>

                        </>

                    }
                    showIcon
                />
            )}
            {isConfirming && (
                <Alert
                    type="warning"
                    message="Waiting for confirmation..."
                    showIcon
                    style={{ marginTop: "10px" }}
                />
            )}
            {isConfirmed && (
                <Alert
                    type="success"
                    message={
                        <>
                            Transaction confirmed.
                            <a
                                href={`${EXPLORER_BASE_URL}/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on Block Explorer
                            </a>

                        </>

                    }
                    showIcon
                    style={{ marginTop: "10px" }}
                />
            )}
        </div>
    );

}

export default RemoveButtonn;