import React from 'react';
import { Button, Typography, Card, Space , Empty} from "antd";

const { Title } = Typography;

export const Pool: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Header */}
      <Space
        direction="horizontal"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <Title level={2}>Your Pools</Title>
        <Space>
          <Button type="primary">Create a Pair</Button>
          <Button type="primary" ghost>
            Add Liquidity
          </Button>
        </Space>
      </Space>

      {/* Empty State */}
      <Card style={{ textAlign: "center" }}>
      <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                No pools found. <br />
                Create a pair or add liquidity to see your pools here.
              </span>
            }
          />
      </Card>

      {/* Explore Pools */}
      <Title level={2}>Explore Pools</Title>
      <Card style={{ textAlign: "center" }}>
        <p>Coming Soon</p>
      </Card>
    </Space>
  </div>

  );
};


