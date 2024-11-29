import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Button, Card, Typography, Spin, Row, Col, Breadcrumb, Skeleton, Table } from 'antd';
import { DotChartOutlined } from '@ant-design/icons';
import { SwapButton } from './SwapButton';
import { formatUnits } from 'ethers';
import { PATHS } from 'src/routes';
const { Text, Title } = Typography;

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

const defaultPool = {
  id: "default-id",
  token0: { id: "default-id", name: "Default Token0", symbol: "DT0", decimals: 18 },
  token1: { id: "default-id", name: "Default Token1", symbol: "DT1", decimals: 18 },
  pair: "default-pair",
  reserve0: "0",
  reserve1: "0",
};

export const PoolDetails: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<{ pool: any }>(GET_POOL_DETAIL, {
    variables: { id: poolId },
  });

  useEffect(() => {
    // Đây là nơi bạn sẽ tải dữ liệu nếu cần thêm logic khác trong tương lai
  }, [poolId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  const pool = data?.pool || defaultPool;

  // Dữ liệu giả cho bảng lịch sử giao dịch
  const transactionHistoryData = [
    {
      key: '1',
      time: '2024-11-29 10:00',
      type: 'Sell Token0 (DT0)',
      usd: '$1000',
      token0: pool.token0.symbol,
      token1: pool.token1.symbol,
      wallet: '0x1234567890abcdef',
    },
    {
      key: '2',
      time: '2024-11-29 11:00',
      type: 'Buy Token1 (DT1)',
      usd: '$1200',
      token0: pool.token0.symbol,
      token1: pool.token1.symbol,
      wallet: '0xabcdef1234567890',
    },
    {
      key: '3',
      time: '2024-11-29 12:00',
      type: 'Add Liquidity',
      usd: '$500',
      token0: pool.token0.symbol,
      token1: pool.token1.symbol,
      wallet: '0x7890abcdef123456',
    },
  ];

  const columns = [
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => {
        const color = text.includes('Sell') ? 'red' : text.includes('Buy') || text.includes('Add') ? 'green' : '';
        return <span style={{ color }}>{text}</span>;
      },
    },
    { title: 'USD', dataIndex: 'usd', key: 'usd' },
    { title: pool.token0.symbol, dataIndex: 'token0', key: 'token0' },
    { title: pool.token1.symbol, dataIndex: 'token1', key: 'token1' },
    { title: 'Wallet', dataIndex: 'wallet', key: 'wallet' },
  ];

  const handleSwap = (fromToken: string, toToken: string, amount: string) => {
    console.log('Swapping', fromToken, toToken, amount);
    // Thực hiện logic swap ở đây (gọi hợp đồng thông minh)
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: '20px' }}>
        <Breadcrumb.Item>
          <Link to={PATHS.EXPLORE}>Explore</Link>
          
        </Breadcrumb.Item>
        <Breadcrumb.Item>
        <Link to={PATHS.EXPLORE}>Pools</Link>

        </Breadcrumb.Item>
        <Breadcrumb.Item>{poolId}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Title */}
      <Title level={1}>
        {pool.token0.symbol}/{pool.token1.symbol}: Buy and Sell
      </Title>

      <Row gutter={16}>
        {/* Cột 1 - Skeleton cho Chart và Bảng Lịch sử Giao dịch */}
        <Col span={16}>
          <Card title="Chart" bordered={false}>
            <Skeleton active loading={loading} paragraph={{ rows: 8 }} />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <DotChartOutlined
                style={{
                  fontSize: 300,  // Bạn có thể điều chỉnh kích thước biểu đồ tùy ý
                  color: '#bfbfbf',
                }}
              />
            </div>
          </Card>

          <Card title="Transaction History" bordered={false} style={{ marginTop: '20px' }}>
            <Skeleton active loading={loading} paragraph={{ rows: 8 }} />
            <Table
              dataSource={transactionHistoryData}
              columns={columns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Row gutter={16}>
            <Col span={12}>
              <Button
                type="primary"
                onClick={() => navigate(`/add-liquidity/${poolId}`, {
                  state: {
                    token0: pool.token0,
                    token1: pool.token1,
                    pool: pool
                  },
                })}
                size="large"
                block
              >
                + Add Liquidity
              </Button>
            </Col>
            <Col span={12}>
            <SwapButton poolId={poolId!} />
            </Col>
          </Row>

          <Card title="Pool Stats" bordered={false} style={{ marginTop: '20px' }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <>
                 <Title level={4}>Pool Balances</Title>
                 <Text type="success">{formatUnits(data?.pool.reserve0)} {data?.pool.token0.symbol}</Text> / 
                 <Text type="danger"> {formatUnits(data?.pool.reserve1)} {data?.pool.token1.symbol}</Text>
                
                <Title level={4}>Total Volume Locked</Title>
                <p>${(parseFloat(data?.pool.reserve0 || '0') + parseFloat(data?.pool.reserve1 || '0')).toFixed(2)}</p>
                <Title level={4}>24H Volume</Title>
                <p>24H Volume: {/* Bạn có thể thay thế bằng dữ liệu Volume ở đây */}</p>
                <Title level={4}>24H Fees</Title>
                <p>24H Fees: {/* Bạn có thể thay thế bằng dữ liệu Fees ở đây */}</p>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
