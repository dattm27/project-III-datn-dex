import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Alert, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { useWriteContract, useWaitForTransactionReceipt, useAccount} from "wagmi"; // Replace with actual hooks
import { ConnectWallet } from "src/components/ConnectWalletButton";
import { getTokens, getPools } from "src/services";
import { parseUnits } from "ethers";
import { POOL_ABI } from "src/web3/abis";
import { Address } from "viem";
import { Allowance } from "./Allowance";
const { Option } = Select;
const { Text } = Typography;

export const AddLiquidity: React.FC = () => {
  const location = useLocation();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [token0, setToken0] = useState<Token | null>(null);
  const [token1, setToken1] = useState<Token | null>(null);
  const [token0Amount, setToken0Amount] = useState("");
  const [token1Amount, setToken1Amount] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const { isConnected , address} = useAccount();


  useEffect(() => {
    async function fetchData() {
      try {
        const tokensData = await getTokens();
        const poolsData = await getPools();

        setTokens(tokensData);
        setPools(poolsData);

        if (tokensData.length > 1) {
          setToken0(location.state.token0 || tokensData[0]);
          setToken1(location.state.token1 || tokensData[1]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [location]);

  useEffect(() => {
    if (token0 && token1) {
      const pool = pools.find(
        (p: Pool) =>
          (p.token0.symbol === token0.symbol && p.token1.symbol === token1.symbol) ||
          (p.token0.symbol === token1.symbol && p.token1.symbol === token0.symbol)
      );
      setSelectedPool(pool || null);
    }
  }, [token0, token1, pools]);

  const calculateAmount1 = (amount0: string) => {
    if (selectedPool && amount0) {
      const reserve0 = parseFloat(selectedPool.reserve0);
      const reserve1 = parseFloat(selectedPool.reserve1);
      const amount1 = (reserve1 / reserve0) * parseFloat(amount0);
      return amount1.toFixed(6);
    }
    return "";
  };

  const calculateAmount0 = (amount1: string) => {
    if (selectedPool && amount1) {
      const reserve0 = parseFloat(selectedPool.reserve0);
      const reserve1 = parseFloat(selectedPool.reserve1);
      const amount0 = (reserve0 / reserve1) * parseFloat(amount1);
      return amount0.toFixed(6);
    }
    return "";
  };

  const { data: hash, isPending, writeContract: addLiquidity} = useWriteContract();

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
            <ConnectWallet block={true}/>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isPending}
              disabled={isPending}
            >
              {isPending ? "Confirming" : "Add Liquidity"}
            </Button>)}
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
      {isConnected  && <Allowance
        tokenAddress={"0x19D2b324DA54d176a44039ED780656Ea937AFB0F"
        }
        ownerAddress={address!}
        spenderAddress={"0x568f46d6df765fc093f852fe6cde5e0d4311761b"}
      />}

    </div>
  );
};
