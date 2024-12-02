import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Row, Col, Typography, message } from 'antd';
import { SwapOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import { formatUnits, parseUnits } from 'ethers';
import { useAccount, useWriteContract } from 'wagmi';
import { ConnectWallet } from 'src/components/ConnectWalletButton';
import { useCheckAllowance, useCheckBalance } from 'src/web3/ERC20Token/readContract';
import { ApproveERC20Button } from '../AddLiquidity/ApproveERC20TokenButton';
import {Address} from 'viem';
const { Title } = Typography;
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
  const [tokenIn, setTokenIn] = useState<string>(''); //token in
  const [tokenOut, setTokenOut] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [amountIn, setAmountIn] = useState<string>('');
  const [amountOut, setAmountOut] = useState<string>('');


  // Khi dữ liệu pool được tải, thiết lập giá trị ban đầu cho các token
  useEffect(() => {
    if (data) {
      setTokenIn(data.pool.token0.symbol);
      setTokenOut(data.pool.token1.symbol);
    }
  }, [data]);

  //update lai amountOut moi lan amountIn thay doi
  function calculateAmountOut(amountIn: string) {
    if (amountIn) {
      const reserve0 = BigInt(data!.pool.reserve0);
      const reserve1 = BigInt(data!.pool.reserve1);
      const amountInWithFee = parseUnits(amountIn) * BigInt(997) / BigInt(1000);
      let amountOut;
      if (tokenIn == data?.pool.token0.symbol) {
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
    if (amountIn) {
      const reserve0 = BigInt(data!.pool.reserve0);
      const reserve1 = BigInt(data!.pool.reserve1);
      let amountIn;
      const _amountOut = parseUnits(amountOut)
      if (tokenOut == data?.pool.token0.symbol) {
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
  const { isConnected, address } = useAccount();
  const { data: allowance } = useCheckAllowance({ tokenAddress: data!.pool.token0.id, ownerAddress: address!, spenderAddress: poolId!, autoRefetch: true })
  const { data: balanceTokenIn } = useCheckBalance({ tokenAddress: data!.pool.token0.id, accountAddress: address! });

  const { data: hash, isPending, writeContract } = useWriteContract();
  async function swap() {
    try {
      writeContract({
        abi: POOL_ABI,
        address: poolId as Address,
        functionName : "swap",
        args: [token0.id, parseUnits(amountIn)]

      })
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleSwap = () => {
    if (amountIn && parseFloat(amount) > 0) {
      // Tính toán số token nhận được
      const reserve0 = parseFloat(data!.pool.reserve0);
      const reserve1 = parseFloat(data!.pool.reserve1);
      const amountToReceive = (parseFloat(amount) * reserve1) / reserve0;

      message.success(`Swapped ${amount} ${tokenIn} for ${amountToReceive.toFixed(2)} ${tokenOut}`);

      // Đóng modal sau khi swap thành công
      toggleModal();

      // Làm sạch trường nhập sau khi swap
      setAmount('');
    } else {
      message.error('Please enter a valid amount');
    }
  };

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
            <Title level={4}>Sell: {tokenIn}</Title>
            {/* amoutn out - Sell token */}
            <Input
              value={amountIn}
              onChange={(e) => {
                setAmountIn(e.target.value);
                setAmountOut(calculateAmountOut(e.target.value));
              }}
              placeholder={`Enter amount of ${tokenIn}`}
              type="number"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Title level={4}>Buy: {tokenOut}</Title>
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
              Swap {tokenIn} & {tokenOut}
            </Button>
            {!isConnected ? (<ConnectWallet block={true} />)
              : !(parseFloat(balanceTokenIn?.toString() || "0") >= parseUnits(amountIn?.toString() || "0")) ?
              (<ApproveERC20Button
                tokenAddress= {token0.id}
                spenderAddress = {poolId}
                amount = {parseUnits(amountIn).toString() }
                token={token0}
                />
              )
              :<Button
                type="primary"
                icon={<SwapOutlined />}
                size="large"
                onClick={() => swap()}
                loading = {isPending}
                style={{ width: '100%' }}
              >
                Swap
              </Button>}

          </Col>
        </Row>
      </Modal>
    </>
  );
};
