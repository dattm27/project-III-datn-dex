import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Row, Col, Typography, message, Alert } from 'antd';
import { SwapOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import { formatUnits, parseUnits } from 'ethers';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectWallet } from 'src/components/ConnectWalletButton';
import { useCheckAllowance, useCheckBalance } from 'src/web3/ERC20Token/readContract';
import { ApproveERC20Button } from '../AddLiquidity/ApproveERC20TokenButton';
import { Address } from 'viem';
const { Title, Text } = Typography;
import { POOL_ABI } from 'src/web3/abis';

const GET_POOL_DETAIL = gql`
  query GetPool($id: String!) {
    pool(id: $id) {
      id
      token0 {
        id
        name
        symbol
        decimals
      }
      token1 {
        id
        name
        symbol
        decimals
      }
      reserve0
      reserve1
    }
  }
`;

interface SwapButtonProps {
  poolId: string;  // ID của pool
  token0: Token;
  token1: Token;

}

export const SwapButton: React.FC<SwapButtonProps> = ({ poolId, token0, token1 }) => {
  const { loading, error, data } = useQuery<{ pool: Pool }>(GET_POOL_DETAIL, {
    variables: { id: poolId },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [tokenIn, setTokenIn] = useState<Token>(token0); //token in
  const [tokenOut, setTokenOut] = useState<Token>(token1);
  const [amount, setAmount] = useState<string>('');
  const [amountIn, setAmountIn] = useState<string>('');
  const [amountOut, setAmountOut] = useState<string>('');
  const { isConnected, address } = useAccount();
  const { data: allowanceTokenIn } = useCheckAllowance({ tokenAddress: tokenIn.id, ownerAddress: address!, spenderAddress: poolId!, autoRefetch: true })
  const { data: balanceTokenIn } = useCheckBalance({ tokenAddress: tokenIn.id, accountAddress: address! });
  const [sufficientBalance, setSufficientBalance] = useState<boolean>(true);
  const [sufficientAllowance, setSufficientAllowance] = useState<boolean>(true);

  // Khi dữ liệu pool được tải, thiết lập giá trị ban đầu cho các token
  useEffect(() => {

  }, [data]);

  useEffect(() => {
    if (amountIn != "") {
      setSufficientBalance(parseFloat(balanceTokenIn?.toString() || "0") >= parseUnits(amountIn?.toString() || "0"));
      setSufficientAllowance(parseFloat(allowanceTokenIn?.toString() || "0") >= parseUnits(amountIn?.toString() || "0"));
    }
    else {
      setSufficientBalance(true);
      setSufficientAllowance(true);
    }
  }, [allowanceTokenIn, balanceTokenIn, amountIn])
  //update lai amountOut moi lan amountIn thay doi
  function calculateAmountOut(amountIn: string) {
    if (amountIn) {
      const reserve0 = BigInt(data!.pool.reserve0);
      const reserve1 = BigInt(data!.pool.reserve1);
      const amountInWithFee = parseUnits(amountIn) * BigInt(997) / BigInt(1000);
      let amountOut;
      if (tokenIn == data?.pool.token0) {
        amountOut = reserve1 * amountInWithFee / (reserve0 + amountInWithFee);
      }
      else {
        amountOut = reserve0 * amountInWithFee / (reserve1 + amountInWithFee);
      }
      return formatUnits(amountOut.toString());
    }
    else return "";

  }

  //update lai amountIn moi lan amountOut thay doi
  function calculateAmountIn(amountOut: string) {
    console.log("amountOut changed to", amountOut);
    if (amountOut) {
      const reserve0 = BigInt(data!.pool.reserve0);
      const reserve1 = BigInt(data!.pool.reserve1);
      let amountIn;
      const _amountOut = parseUnits(amountOut)
      if (tokenOut == data?.pool.token0) {
        amountIn = (reserve1 * _amountOut) / (reserve0 - _amountOut);
      }
      else {
        amountIn = (reserve0 * _amountOut) / (reserve1 - _amountOut);

      }

      const amountInWithFee = amountIn * BigInt(1003) / BigInt(1000);
      return formatUnits(amountInWithFee.toString());
    }
    else {
      return "";
    }
  }



  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Đảo ngược các token khi người dùng nhấn "Swap"
  const handleSwapDirection = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn('');
    setAmountOut('');
  };

  //check balance token in  

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });



  async function swap() {
    const tokenInId = token0 == tokenIn ? token0.id : token1.id;
    console.log(tokenInId);
    try {
      writeContract({
        abi: POOL_ABI,
        address: poolId as Address,
        functionName: "swap",
        args: [tokenInId, parseUnits(amountIn)]

      })
    }
    catch (error) {
      console.log(error);
    }
  }


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading pool details</p>;

  return (
    <>
      <Button
        type="primary"
        onClick={toggleModal}
        icon={modalVisible ? <CloseOutlined /> : <SwapOutlined />}
        size="large"
        style={{ width: '100%' }}
      >
        {modalVisible ? 'Close' : 'Swap'}
      </Button>

      {/* Modal for Swap */}
      <Modal
        title="Swap Tokens"
        visible={modalVisible}
        onCancel={toggleModal}
        footer={null}
        width={500}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Title level={4}>Sell: {tokenIn.symbol}</Title>
            {/* amoutn out - Sell token */}
            <Input
              value={amountIn}
              onChange={(e) => {
                setAmountIn(e.target.value);
                setAmountOut(calculateAmountOut(e.target.value));
              }}
              placeholder={`Enter amount of ${tokenIn.symbol}`}
              type="number"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Title level={4}>Buy: {tokenOut.symbol}</Title>
            {/* amoutn out */}
            <Input
              value={amountOut}
              onChange={(e) => {
                setAmountOut(e.target.value);
                setAmountIn(calculateAmountIn(e.target.value));

              }}
              placeholder={`You will receive`}
              type="number"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Button
              type="default"
              icon={<SwapOutlined />}
              size="large"
              onClick={handleSwapDirection}
              style={{ width: '100%', marginBottom: 16 }}
            >
              Swap {tokenIn.symbol} & {tokenOut.symbol}
            </Button>
            {!isConnected ? (<ConnectWallet block={true} />)
              : !sufficientBalance ?
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  danger
                >
                  Insufficient Balance
                </Button>
                : !sufficientAllowance ?
                  (<ApproveERC20Button
                    tokenAddress={tokenIn.id}
                    spenderAddress={poolId}
                    amount={(amountIn).toString()}
                    token={tokenIn}
                  />
                  )
                  : <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    size="large"
                    onClick={() => swap()}
                    loading={isPending}
                    style={{ width: '100%' }}
                  >
                    {isPending ? "Confirming" : "Swap"}
                  </Button>}
            Allowance: {allowanceTokenIn?.toString()}
            Balance: {formatUnits(balanceTokenIn?.toString() || "0")}
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

          </Col>
        </Row>
      </Modal>
    </>
  );
};
