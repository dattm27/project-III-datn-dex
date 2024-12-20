import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchGql } from "src/hooks/useFetch";
import { getPoolPosition } from "src/services/pools/pool_gql";
import { Card, Typography, Slider, Spin, Alert, Row, Col, InputNumber} from "antd";
import BackButton from "src/components/common/BackButton";
import { formatUnits } from "ethers";
import { toBigInt } from "ethers";
import RemoveButtonn from "./RemoveButton";
const { Text } = Typography;

const RemoveLiquidity: React.FC = () => {
    const { poolId, user } = useParams<{ poolId: string; user: string }>();

    const { data: positionData, loading, error } = useFetchGql<{ liquidityPosition: liquidityPosition }>(
        getPoolPosition(poolId!, user!)
    );
    const position = positionData?.liquidityPosition;

    const [percentage, setPercentage] = useState<number>(0);

    const liquidityAmount = position?.shares || 0;
    const sharesTORemove = (toBigInt(liquidityAmount) * toBigInt(percentage)) / toBigInt(100);

    const token0Amount = position?.token0Amount || 0;
    const token1Amount = position?.token1Amount || 0;

    return (
        <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card
                title={
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            justifyContent: "center",
                            marginBottom: "10px",
                            height: "100px",
                        }}
                    >
                        <BackButton />
                        <Typography.Title level={2}>Remove Liquidity</Typography.Title>
                    </div>
                }
                bordered
                style={{
                    width: "40vw",
                    maxWidth: "600px",
                    margin: "20px auto",
                    paddingTop: "20px",
                }}
            >
                {loading && (
                    <div style={{ textAlign: "center" }}>
                        <Spin /> <Text>Loading...</Text>
                    </div>
                )}

                {error && (
                    <Alert
                        type="error"
                        message="Error fetching liquidity data"
                        description={error}
                        showIcon
                    />
                )}

                {positionData && (
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <Text>Select Percentage:</Text>
                            <Row>
                                <Col span={18}>
                                    <Slider
                                        min={0}
                                        max={100}
                                        value={percentage}
                                        onChange={(value) => setPercentage(value)}
                                        marks={{
                                            0: "0%",
                                            50: "50%",
                                            100: "100%",
                                        }}
                                    />
                                </Col>
                                <Col span={4}>
                                    <InputNumber
                                        min={1}
                                        max={100}
                                        style={{ margin: '0 16px' }}
                                        value={percentage}
                                        onChange={(value) => setPercentage(value || 1)}
                                    />
                                </Col>

                            </Row>

                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <Text strong>{position?.pool.token0.symbol}:</Text> {formatUnits(((toBigInt(token0Amount) * toBigInt(percentage)) /toBigInt(100)).toString())}
                            <br />
                            <Text strong>{position?.pool.token1.symbol}:</Text> {formatUnits(((toBigInt(token1Amount) * toBigInt(percentage)) /toBigInt(100)).toString())}
                            <br />
                        </div>

                        <RemoveButtonn 
                            poolId={poolId || ""}
                            shares={sharesTORemove.toString()}
                        />

                        <div style={{ marginTop: 30 }}>
                            <Text strong>Your Pool Position:</Text>
                            <br />
                            <Text strong>Shares:</Text> {position?.shares}
                            <br />
                            <Text strong>Pooled {position?.pool.token0.symbol}:</Text> {formatUnits(position?.token0Amount || 0)}
                            <br />
                            <Text strong>Pooled {position?.pool.token1.symbol}:</Text> {formatUnits(position?.token1Amount || 0)}
                            <br />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RemoveLiquidity;
