import { useAccount } from "wagmi";
import { Card, Empty, Space, Typography, Button, Row, Col, Spin } from "antd";
import { useFetchGql } from "src/hooks/useFetch";
import { getLiquidityPositionsQuery } from "src/services/pools/pool_gql";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const YourPools: React.FC = () => {
    const navigate = useNavigate(); 
    const { address, isConnected } = useAccount();
    const { data, loading, error } = useFetchGql<{ liquidityPositions: liquidityPosition[] }>(
      address ?  getLiquidityPositionsQuery(address! as string, { offset: 0, limit: 10 }) : ""
    );


    const positons = data?.liquidityPositions;

    if (!isConnected) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <span>
                        Please connect your wallet <br />
                        to view your pools.
                    </span>
                }
            />
        );
    }

      

    if (error) {
        return (
            <Card style={{ textAlign: "center" }}>
                <p>Error fetching pools: {error}</p>
            </Card>
        );
    }

    return loading ? (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card>
            <Spin />
            </Card>
        </Space>
    ) : positons && positons.length > 0 ? (

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
             <Row justify="space-between" gutter={[16, 16]}>
             <Col span={4}>
              <Text type="secondary">#</Text>
            </Col>
            <Col span={4}>
              <Text type="secondary">Pool</Text>
            </Col>
            <Col span={6}>
              <Text type="secondary">Shares</Text>
            </Col>
            <Col span={4}>
           
            </Col>
            </Row>
            
        {positons.map((position, index) => (
        
            <Row  key={position.pool.id} justify="space-between" gutter={[16, 16]}>
             <Col span={4}>
              <Text strong>{index + 1}</Text>
            </Col>
            <Col span={4}>
              <Text strong>
                {position.pool.token0.symbol}/{position.pool.token1.symbol}
              </Text>
            </Col>
            <Col span={6}>
              <Text>{position.shares}</Text>
            </Col>
            <Col span={4}>
            <Button
           
                danger
                style={{ width: "100%" }}
                onClick={() => navigate(`/remove-liquidity/${position.pool.id}/${address}`, {
                  state: {
                    token0: position.pool.token0,
                    token1: position.pool.token1,
                    pool: position.pool
                  },
                })}
              >
                Remove Liquidity
              </Button>
            </Col>
            </Row>
            
        ))}
      </Space>
    ) : (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span>
                    No pools found. <br />
                    Create a pair or add liquidity to see your pools here.
                </span>
            }
        />
    );
};

export default YourPools;