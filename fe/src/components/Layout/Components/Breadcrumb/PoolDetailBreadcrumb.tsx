import { PATHS } from "src/routes";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
export function PoolDetailBreadcrumb(poolId: string | undefined) {
    return <Breadcrumb style={{ marginBottom: '20px' }}>
      <Breadcrumb.Item>
        <Link to={PATHS.EXPLORE}>Explore</Link>
  
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={PATHS.EXPLORE}>Pools</Link>
  
      </Breadcrumb.Item>
      <Breadcrumb.Item>{poolId}</Breadcrumb.Item>
    </Breadcrumb>;
  }