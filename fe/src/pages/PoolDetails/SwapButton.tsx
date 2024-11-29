import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Row, Col, Typography, message } from 'antd';
import { SwapOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';

const { Title } = Typography;

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
}

export const SwapButton: React.FC<SwapButtonProps> = ({ poolId }) => {
  const { loading, error, data } = useQuery<{ pool: Pool }>(GET_POOL_DETAIL, {
    variables: { id: poolId },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  // Khi dữ liệu pool được tải, thiết lập giá trị ban đầu cho các token
  useEffect(() => {
    if (data) {
      setFromToken(data.pool.token0.symbol);
      setToToken(data.pool.token1.symbol);
    }
  }, [data]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Đảo ngược các token khi người dùng nhấn "Swap"
  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount(''); // Xoá số lượng khi đảo chiều
  };

  const handleSwap = () => {
    if (amount && parseFloat(amount) > 0) {
      // Tính toán số token nhận được
      const reserve0 = parseFloat(data!.pool.reserve0);
      const reserve1 = parseFloat(data!.pool.reserve1);
      const amountToReceive = (parseFloat(amount) * reserve1) / reserve0;

      message.success(`Swapped ${amount} ${fromToken} for ${amountToReceive.toFixed(2)} ${toToken}`);
      
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
            <Title level={4}>Sell: {fromToken}</Title>
            <Input 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder={`Enter amount of ${fromToken}`}
              type="number"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Title level={4}>Buy: {toToken}</Title>
            <Input
              value={amount ? (parseFloat(amount) * parseFloat(data!.pool.reserve1) / parseFloat(data!.pool.reserve0)).toFixed(2) : ''}
              disabled
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
              Swap {fromToken} & {toToken}
            </Button>
            <Button
              type="primary"
              icon={<SwapOutlined />}
              size="large"
              onClick={handleSwap}
              style={{ width: '100%' }}
            >
              Swap
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
