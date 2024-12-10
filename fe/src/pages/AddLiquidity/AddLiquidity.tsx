import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Alert, Typography } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi"; // Replace with actual hooks
import { ConnectWallet } from "src/components/ConnectWalletButton";
import { getTokens, getPools, getPoolDetails } from "src/services";
import { parseUnits, } from "ethers";
import { POOL_ABI } from "src/web3/abis";
import { Address } from "viem";
import { useCheckAllowance, useCheckBalance } from "src/web3/ERC20Token/readContract";
import { ApproveERC20Button } from "./ApproveERC20TokenButton";
const { Option } = Select;
const { Text } = Typography;

export const AddLiquidity: React.FC = () => {
  const location = useLocation();
  const { poolId } = useParams<{ poolId: string }>();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [token0, setToken0] = useState<Token | null>(location.state.token0);
  const [token1, setToken1] = useState<Token | null>(location.state.token1);
  const [token0Amount, setToken0Amount] = useState("");
  const [token1Amount, setToken1Amount] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const { isConnected, address } = useAccount();
  const [sufficientBalance, setSufficientBalance] = useState<boolean>(true);
  const [sufficientAllowance0, setSufficientAllowance0] = useState<boolean>(true);
  const [sufficientAllowance1, setSufficientAllowance1] = useState<boolean>(true);

  useEffect(() => {
    // Fetch các dữ liệu khác
    async function fetchData() {
      try {
        const tokensData = await getTokens();
        const poolsData = await getPools();
        const pool = await getPoolDetails(poolId!);
        setTokens(tokensData);
        setPools(poolsData);
        setSelectedPool(pool);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(token0);
    console.log(token1?.id);
    console.log('selected pool', selectedPool);
  }, [selectedPool])


  useEffect(() => {
    if (token0 && token1) {
      const pool = pools.find(
        (p: Pool) =>
          (p.token0.symbol === token0.symbol && p.token1.symbol === token1.symbol) ||
          (p.token0.symbol === token1.symbol && p.token1.symbol === token0.symbol)
      );
      setSelectedPool(pool || null);
      console.log(selectedPool);
    }
  }, [token0, token1, pools]);

  const { data: allowance0 } = useCheckAllowance({ tokenAddress: token0!.id, ownerAddress: address!, spenderAddress: poolId!, autoRefetch: true})
  const { data: allowance1 } = useCheckAllowance({ tokenAddress: token1!.id, ownerAddress: address!, spenderAddress: poolId!, autoRefetch: true })
  const { data: balance1 } = useCheckBalance({ tokenAddress: token1!.id, accountAddress: address! });
  const { data: balance0 } = useCheckBalance({ tokenAddress: token0!.id, accountAddress: address! });
  
  //to improve: debouncing 
  const calculateAmount1 = (amount0: string) => {
    if (selectedPool && amount0) {
      const reserve0 = parseFloat(selectedPool.reserve0);
      const reserve1 = parseFloat(selectedPool.reserve1);
      const amount1 = (reserve1 / reserve0) * parseFloat(amount0);

      //check balance insufficient
      if (parseFloat(balance0?.toString() || "0") >= parseUnits(amount0) && parseFloat(balance1?.toString() || "") >= parseUnits(amount1.toString()))
        setSufficientBalance(true);
      else setSufficientBalance(false);
      console.log(balance0, balance1);
      return amount1.toFixed(6);
    }
    return "";
  };

  const calculateAmount0 = (amount1: string) => {
    if (selectedPool && amount1) {
      const reserve0 = parseFloat(selectedPool.reserve0);
      const reserve1 = parseFloat(selectedPool.reserve1);
      const amount0 = (reserve0 / reserve1) * parseFloat(amount1);
      if (parseFloat(balance0?.toString() || "0") >= amount0 && parseFloat(balance1?.toString() || "") >= parseFloat(amount1))
        setSufficientBalance(true);
      else setSufficientBalance(false);
      return amount0.toFixed(6);
    }
    return "";
  };

  //kiểm tra đủ allowance chưa
  useEffect(() => {
    if (token0Amount && token1Amount) {
      const amount0Parsed = parseFloat(token0Amount);
      const amount1Parsed = parseFloat(token1Amount);
  
      if (allowance0 !== undefined && allowance1 !== undefined) {
        // Kiểm tra allowance
        setSufficientAllowance0(parseFloat(allowance0!.toString() || "0") >= parseUnits(amount0Parsed.toString()));
        setSufficientAllowance1(parseFloat(allowance1!.toString() || "0") >= parseUnits(amount1Parsed.toString()));
      }
    }
  }, [allowance0, allowance1, token0Amount, token1Amount]);
  

  const { data: hash, isPending, writeContract: addLiquidity } = useWriteContract();
  const handleAddLiquidity = async () => {
    try {
      addLiquidity({
        abi: POOL_ABI,
        address: selectedPool!.id as Address,
        functionName: "addLiquidity",
        args: [parseUnits(token0Amount), parseUnits(token1Amount)],
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  


  // reset token amount after transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      setToken0Amount("");
      setToken1Amount("");
    }
  }, [isConfirmed]);


  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Typography.Title level={2}>Add Liquidity</Typography.Title>
      <Form
        layout="vertical"
        onFinish={handleAddLiquidity}
      >
        <Form.Item label="Select Pair" required>
          <Input.Group compact>
            <Select
              value={token0?.symbol}
              onChange={(value) =>
                setToken0(tokens.find((t) => t.symbol === value) || null)
              }
              style={{ width: "48%", marginRight: "4%" }}
            >
              {tokens.map((token) => (
                <Option key={token.symbol} value={token.symbol}>
                  {token.symbol} - {token.name}
                </Option>
              ))}
            </Select>
            <Select
              value={token1?.symbol}
              onChange={(value) =>
                setToken1(tokens.find((t) => t.symbol === value) || null)
              }
              style={{ width: "48%" }}
            >
              {tokens.map((token) => (
                <Option key={token.symbol} value={token.symbol}>
                  {token.symbol} - {token.name}
                </Option>
              ))}
            </Select>
          </Input.Group>
        </Form.Item>

        <Form.Item label="Deposit Amount" required>
          <Input.Group compact>
            <Input
              type="number"
              placeholder={`Amount for ${token0?.symbol || ""}`}
              value={token0Amount}
              required
              onChange={(e) => {
                setToken0Amount(e.target.value);
              
                // avoid divide by 0 
                if (parseFloat(selectedPool!.reserve1)) setToken1Amount(calculateAmount1(e.target.value));
              }}
              style={{ width: "48%", marginRight: "4%" }}
            />
            <Input
              type="number"
              placeholder={`Amount for ${token1?.symbol || ""}`}
              value={token1Amount}
              required
              onChange={(e) => {
                setToken1Amount(e.target.value);
                // avoid divide by 0 
                if (parseFloat(selectedPool!.reserve0)) setToken0Amount(calculateAmount0(e.target.value));
              }}
              style={{ width: "48%" }}
            />
          </Input.Group>
        </Form.Item>

        <Form.Item>
          {!isConnected ? (
            <ConnectWallet block={true} />
          ) : !sufficientBalance ? (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              danger
            >
              Insufficient Balance
            </Button>
          )
            : !sufficientAllowance0 ?
              (
               <ApproveERC20Button
                tokenAddress={token0!.id}
                spenderAddress={selectedPool!.id}
                amount = { (parseFloat(token0Amount)).toString() }
                token={token0!}
               />
              )
              : !sufficientAllowance1 ?
                (
                  <ApproveERC20Button
                  tokenAddress={token1!.id}
                  spenderAddress={selectedPool!.id}
                  amount = { (parseFloat(token1Amount)).toString() }
                  token={token1!}
                 />
                )
                : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isPending}
                    disabled={isPending}
                  >
                    {isPending ? "Confirming" : "Add Liquidity"}
                  </Button>
                )
          }
        </Form.Item>

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
            message="Transaction confirmed."
            showIcon
            style={{ marginTop: "10px" }}
          />
        )}

      </Form>
      Balance 0: {balance0?.toString()}
    </div>
  );
};
