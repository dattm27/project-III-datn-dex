import React from 'react';
import { Button, Typography, Card, Space } from "antd";
import YourPools from './YourPools';

const { Title } = Typography;

export const Pool: React.FC = () => {
  return (
    <div style={{ padding: "24px" }} className='page'>
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
        <YourPools/>
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


