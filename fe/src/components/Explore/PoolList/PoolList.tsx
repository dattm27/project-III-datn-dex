import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Table, Skeleton, Typography } from 'antd';
import { PATHS } from 'src/routes';

const GET_POOLS = gql`
  query {
    pools {
      id
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
      pair
    }
  }
`;

const { Text } = Typography;

export const PoolList: React.FC = () => {
  const { loading, error, data } = useQuery<{ pools: Pool[] }>(GET_POOLS);
  const navigate = useNavigate();

  const handleRowClick = (poolId: string) => {
    const path = PATHS.EXPLORE_POOL.replace(':poolId', poolId);
    navigate(path);
  };

  // Placeholder skeleton for loading state
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text: string, record: { index: number }) => <Text>{record.index + 1}</Text>,
    },
    {
      title: 'Pool',
      dataIndex: 'pair',
      key: 'pair',
      render: (text: string, record: { token0: { symbol: string }, token1: { symbol: string } }) => (
        <Text>{record.token0.symbol} / {record.token1.symbol}</Text>
      ),
    },
    {
      title: 'TVL (USD)',
      dataIndex: 'tvl',
      key: 'tvl',
      render: () => <Text>$0</Text>,
    },
    {
      title: 'APR (%)',
      dataIndex: 'apr',
      key: 'apr',
      render: () => <Text>N/A</Text>,
    },
    {
      title: '1D Vol (USD)',
      dataIndex: 'vol1d',
      key: 'vol1d',
      render: () => <Text>N/A</Text>,
    },
    {
      title: '30D Vol (USD)',
      dataIndex: 'vol30d',
      key: 'vol30d',
      render: () => <Text>N/A</Text>,
    },
    {
      title: '1D Vol / TVL',
      dataIndex: 'volTvl',
      key: 'volTvl',
      render: () => <Text>N/A</Text>,
    },
  ];

  const dataSource = data?.pools.map((pool, index) => ({
    key: pool.id,
    index,
    token0: pool.token0,
    token1: pool.token1,
    pair: `${pool.token0.symbol} / ${pool.token1.symbol}`,
    tvl: 0, 
    apr: 'N/A',
    vol1d: 'N/A',
    vol30d: 'N/A',
    volTvl: 'N/A',
  }));

  // Skeleton for placeholder while loading
  const skeletonColumns = columns.map((col) => ({
    ...col,
    render: () => <Skeleton.Input active size="small" style={{ width: '100px' }} />,
  }));

  return (
    <div>
      <h2>Pools</h2>
      {/* Render Skeleton if loading */}
      {loading ? (
        <Table
          dataSource={Array(5).fill({})} // 5 rows of skeleton placeholders
          columns={skeletonColumns}
          pagination={false}
          rowClassName="clickable-row"
          loading={loading}
        />
      ) : error ? (
        <Text type="danger">Error: {error.message}</Text>
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record.key),
          })}
          rowClassName="clickable-row"
        />
      )}
    </div>
  );
};
