import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Row, Col, Skeleton } from 'antd';
import { SwapButton } from './SwapButton';
import { formatUnits } from 'ethers';
const { Text, Title } = Typography;
import { getTransactionHistory } from 'src/services';
import TransactionHistoryTable from './TransactionHistoryTable';
import { PoolChart } from './PoolChart';
import { useFetchGql } from 'src/hooks/useFetch';
import { getPoolDetailsQuery } from 'src/services/pools/pool_gql';
import { PoolDetailBreadcrumb } from 'src/components/Layout';
export const PoolDetails: React.FC = () => {

  const navigate = useNavigate();
  const { poolId } = useParams<{ poolId: string }>();
  const [loading, setLoading] = useState(false); // State for loading
  const [transactionHistories, setTransactionHistories] = useState<TransactionHistory[]>([]);
  const [total, setTotal] = useState(0); // Tổng số giao dịch
  const [page, setPage] = useState(1); // Trang hiện tại


  const fetchTransactionHistory = async (currentPage: number) => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * 20;
      const limit = 20;
      const transactions = await getTransactionHistory(poolId!, { offset, limit });
      setTransactionHistories(transactions);
      setTotal(100); 
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory(page);
  }, [page]);


  const { data: poolData, loading: poolLoading} = useFetchGql<{ pool: Pool }>(getPoolDetailsQuery(poolId!));
  const pool = poolData?.pool;

  return (
    <div style= {{marginBottom: '20px'}} >
      {poolId && PoolDetailBreadcrumb(poolId)}

      <Title level={1}>
        <Skeleton active loading={poolLoading} paragraph={{ rows: 1 }} title />
        {pool && `${pool?.token0.symbol}/${pool?.token1.symbol}: Buy and Sell`}
      </Title>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="Price History" bordered={false}>
            <Skeleton active loading={loading} paragraph={{ rows: 8 }} />
            <PoolChart poolId={poolId!} blockTimestamp={0}/>
          </Card>

          <Card title="Transaction History" bordered={false} style={{ marginTop: '20px' }}>
            {pool  && <TransactionHistoryTable
              pool={pool}
              transactionHistories={transactionHistories}
              total={total}
              page={page}
              onPageChange={setPage}
              loading={loading}
            />}
          </Card>
        </Col>
        <Col span={8}>
          <Row gutter={16}>
            <Col span={12}>
              <Button
                type="primary"
                onClick={() => navigate(`/add-liquidity/${poolId}`, {
                  state: {
                    token0: pool?.token0,
                    token1: pool?.token1,
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
              {
                pool ? (<SwapButton
                  poolId={poolId!}
                  token0={pool!.token0}
                  token1={pool!.token1}
                />) : <Skeleton.Button active />
              }

            </Col>
          </Row>
          <Card title="Pool Stats" bordered={false} style={{ marginTop: '20px' }}>
            {!poolData ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <>
                <Title level={4}>Pool Balances</Title>
                <Text type="success">{formatUnits(pool?.reserve0 || "0")} {pool?.token0.symbol}</Text> /
                <Text type="danger"> {formatUnits(pool?.reserve1 || "0")} {pool?.token1.symbol}</Text>

                <Title level={4}>Total Volume Locked</Title>
                <p>${(parseFloat(pool?.reserve0 || '0') + parseFloat(pool?.reserve1 || '0')).toFixed(2)}</p>
                <Title level={4}>24H Volume</Title>
                <p>24H Volume:</p>
                <Title level={4}>24H Fees</Title>
                <p>24H Fees:</p>
              </>
            )}
          </Card>
        </Col>
      </Row>


    </div>
  );
  

};


