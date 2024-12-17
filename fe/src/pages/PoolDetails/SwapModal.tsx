import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Row, Col, Typography, Spin, Alert } from 'antd';
import { useFetchGql } from 'src/hooks/useFetch';
import { getPoolsQuery, getTokensQuery } from 'src/services/pools/pool_gql';
import { parseUnits, formatUnits } from 'ethers';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectWallet } from 'src/components/ConnectWalletButton';
import { useCheckAllowance, useCheckBalance } from 'src/web3/ERC20Token/readContract';
import { POOL_ABI } from 'src/web3/abis';
import {Address} from 'viem';
import { ApproveERC20Button } from '../AddLiquidity/ApproveERC20TokenButton';
const { Option } = Select;
const { Title, Text } = Typography;
import { EXPLORER_BASE_URL } from 'src/constants';

const TokenSwap: React.FC = () => {
      const [pool, setPool] = useState<Pool | null>(null);
    
    const [tokenIn, setTokenIn] = useState<string | null>(null);
    const [tokenOut, setTokenOut] = useState<string | null>(null);
    const [amountIn, setAmountIn] = useState<string>('');
    const [amountOut, setAmountOut] = useState<string>('');
    const { loading: tokensLoading, data: tokensData } = useFetchGql<{ tokens: Token[] }>(getTokensQuery());
    const { loading: poolsLoading, data: poolsData } = useFetchGql<{ pools: Pool[] }>(getPoolsQuery());
    const { isConnected, address } = useAccount();
    const { data: allowanceTokenIn } = useCheckAllowance({ tokenAddress: tokenIn!, ownerAddress: address!, spenderAddress: pool?.id, autoRefetch: true })
    const { data: balanceTokenIn } = useCheckBalance({ tokenAddress: tokenIn!, accountAddress: address! });
    const [sufficientBalance, setSufficientBalance] = useState<boolean>(true);
    const [sufficientAllowance, setSufficientAllowance] = useState<boolean>(true);
    
    // Khi có tokenIn, cập nhật danh sách các tokenOut có pool
    const handleTokenInChange = (value: string) => {
        setTokenIn(value);
        setTokenOut(null); // Reset tokenOut khi thay đổi tokenIn
        setAmountOut("");

    };

    const handleTokenOutChange = (value: string) => {
        setTokenOut(value);

    };

    useEffect(() => {
        if (tokenIn && amountIn) {
            handleAmountInChange(amountIn)
        };
    }, [tokenOut, tokenIn, amountIn])

    const handleAmountInChange = (newAmountIn: string) => {
        setAmountIn(newAmountIn);
        if (tokenIn && tokenOut && newAmountIn) {
            const pool = poolsData?.pools?.find(pool =>
                (pool.token0.id === tokenIn && pool.token1.id === tokenOut) ||
                (pool.token0.id === tokenOut && pool.token1.id === tokenIn)
            );


            if (pool) {
                setPool(pool);
                const reserve0 = BigInt(pool.reserve0);
                const reserve1 = BigInt(pool.reserve1);
                console.log(reserve0, reserve1);
                const amountInWithFee = parseUnits(newAmountIn) * BigInt(997) / BigInt(1000);
                let amountOut;
                if (pool.token0.id == tokenIn) {
                    amountOut = reserve1 * amountInWithFee / (reserve0 + amountInWithFee);
                }
                else {
                    amountOut = reserve0 * amountInWithFee / (reserve1 + amountInWithFee);
                }

                setAmountOut(formatUnits(amountOut));

                console.log(amountOut);
            }
        }

        else setAmountOut("");
       

    };

    const handleAmountOutChange = (newAmountOut: string) => {
        setAmountOut(newAmountOut);

        if (tokenIn && tokenOut && newAmountOut) {
            const pool = poolsData?.pools?.find(pool =>
                (pool.token0.id === tokenIn && pool.token1.id === tokenOut) ||
                (pool.token0.id === tokenOut && pool.token1.id === tokenIn)
            );



            if (pool) {
                const reserve0 = BigInt(pool.reserve0);
                const reserve1 = BigInt(pool.reserve1);
                console.log(reserve0, reserve1);
                const amountOut = parseUnits(newAmountOut);
                let amountIn;
                if (pool.token0.id == tokenIn) {
                    amountIn = reserve1 * amountOut / (reserve0 - amountOut);
                }
                else {
                    amountIn = reserve0 * amountOut / (reserve1 - amountOut);
                }

                setAmountIn(formatUnits(amountIn * BigInt(1003) / BigInt(1000)));  //includes trading fee
            }
        }
        else setAmountIn("");
    };


    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });


    useEffect(() => {
        if (isConfirmed) {
            setAmountIn('');
            setAmountOut('');

        }
    }, [isConfirmed]);

    useEffect(() => {
        if (amountIn != "" && tokenIn ) {
            setSufficientBalance(parseFloat(balanceTokenIn?.toString() || "0") >= parseUnits(amountIn?.toString() || "0"));
            setSufficientAllowance(parseFloat(allowanceTokenIn?.toString() || "0") >= parseUnits(amountIn?.toString() || "0"));
        }
        else {
            setSufficientBalance(true);
            setSufficientAllowance(true);
        }
    }, [allowanceTokenIn, balanceTokenIn, amountIn, tokenIn])

    async function swap() {
        const tokenInId = pool!.token0.id == tokenIn ? pool!.token0.id : pool!.token1.id;
    
        try {
            writeContract({
                abi: POOL_ABI,
                address: pool!.id as Address,
                functionName: "swap",
                args: [tokenInId, parseUnits(amountIn)]

            })
        }
        catch (error) {
            console.log(error);
        }
    }


    if (tokensLoading || poolsLoading) {
        return <Spin size="large" />;
    }

    const tokens = tokensData?.tokens || [];
    const pools = poolsData?.pools || [];

    const tokenOutOptions = pools
        .filter(pool => pool.token0.id === tokenIn || pool.token1.id === tokenIn)
        .map(pool => (pool.token0.id === tokenIn ? pool.token1 : pool.token0));

    return (
        <div className="swap-container" style={{ padding: '20px', maxWidth: '500px', margin: 'auto', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Title level={3} style={{ textAlign: 'center' }}>Swap anytime, anywhere.</Title>

            {/* Token In and Amount */}
            <Row gutter={16} style={{ marginBottom: '15px' }}>
                <Col span={16}>
                    <Text>Sell</Text>
                    <Input
                        type="number"
                        value={amountIn}
                        onChange={(e) => handleAmountInChange(e.target.value)}
                        placeholder="0"
                        style={{ marginBottom: '10px' }}
                    />
                </Col>
                <Col span={8}>
                    <Text>Token</Text>
                    <Select
                        value={tokenIn}
                        onChange={handleTokenInChange}
                        style={{ width: '100%' }}
                        placeholder="Select token"
                    >
                        {tokens.map((token) => (
                            <Option key={token.id} value={token.id}>
                                {token.symbol}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: '15px' }}>
                <Col span={16}>
                    <Text>Buy</Text>
                    <Input
                        type="number"
                        value={amountOut}
                        onChange={(e) => handleAmountOutChange(e.target.value)}
                        // disabled
                        placeholder="0"
                        style={{ marginBottom: '10px' }}
                    />
                </Col>
                <Col span={8}>
                    <Text>Token</Text>
                    <Select
                        value={tokenOut}
                        onChange={handleTokenOutChange}
                        style={{ width: '100%' }}
                        placeholder="Select token"
                    // disabled={!tokenIn}
                    >
                        {tokenOutOptions.map((token) => (
                            <Option key={token.id} value={token.id}>
                                {token.symbol}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            {!isConnected ? (<ConnectWallet block={true} />)
                : !sufficientBalance && tokenIn && tokenOut &&amountIn && amountOut?
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    danger
                >
                    Insufficient Balance
                </Button>
                : 
                !sufficientAllowance && tokenIn && tokenOut &&amountIn && amountOut?
                (<ApproveERC20Button
                    tokenAddress={tokenIn!}
                    spenderAddress={pool!.id}
                    amount={(amountIn).toString()}
                    token={tokenIn!}
                />)
                    :
                (<Button
                    type="primary"
                    block
                    size="large"
                    onClick={()=> swap()}
                    disabled={!tokenIn || !tokenOut || !amountIn || !amountOut}
                    style={{ marginTop: '20px' }}
                >
                    {isPending ? "Confirming" : "Swap"}
                </Button>)
                
            }
            {hash && (
              <Alert
                type="info"
                style={{ marginTop: "10px" }}
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


            {/* Footer */}
            <Text style={{ display: 'block', textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                The largest onchain marketplace. Buy and sell crypto on Ethereum and 11+ other chains.
            </Text>
        </div>
    );
};

export default TokenSwap;
