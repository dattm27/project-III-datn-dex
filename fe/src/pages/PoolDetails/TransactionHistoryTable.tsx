import { Empty, Table, Pagination } from 'antd';
import { formatUnits } from 'ethers';
export type TransactionHistoryTableProps = {
    transactionHistories: TransactionHistory[];
    total: number;
    onPageChange?: (page: number) => void;
    page: number;
    loading: boolean;
};
const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
    transactionHistories,
    total,
    onPageChange,
    page,
    loading
}) => {
    if (!total) return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />);
    const columns = [
        {
          title: "Timestamp",
          dataIndex: "timestamp",
          key: "timestamp",
          render: (timestamp: string) =>
            new Date(Number(timestamp) * 1000).toLocaleString(),
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
        },
        {
          title: "Amount0",
          key: "amount0",
          render: (record: TransactionHistory) => {
            const { mint, burn, swap } = record;
            let amount: string = "0";
            if (mint) amount = mint.amount0;
            if (burn) amount = burn.amount0;
            if (swap) {
                if (swap.amount0In != '0') amount = swap.amount0In 
                if (swap.amount0Out != '0') amount = swap.amount0Out
            }
            if (amount != '0') {
                const roundedAmount = parseFloat(formatUnits(amount)).toFixed(5);
                return parseFloat(roundedAmount).toString();
            }
        
            return "-";
          },
        },
        {
          title: "Amount1",
          key: "amount1",
          render: (record: TransactionHistory) => {
            const { mint, burn, swap } = record;
            let amount: string = "0";
            if (mint) amount = mint.amount1;
            if (burn) amount = burn.amount1;
            if (swap) {
                if (swap.amount1In != '0') amount = swap.amount1In 
                if (swap.amount1Out != '0') amount =  swap.amount1Out
            }
            if (amount != '0') {
                const roundedAmount = parseFloat(formatUnits(amount)).toFixed(5);
                return parseFloat(roundedAmount).toString();
            }
            return "-";
          },
        },
        {
          title: "Sender",
          dataIndex: "sender",
          key: "sender",
        },
      ];
    
      return (
        <div>
          <Table
            columns={columns}
            dataSource={transactionHistories}
            loading={loading}
            pagination={false} // Disable default pagination
            rowKey="id" // Set unique key for rows
          />
          <Pagination
            current={page}
            total={total}
            pageSize={10} // Show 10 records per page
            onChange={(page) => onPageChange &&  onPageChange(page)}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </div>
      );
}

export default TransactionHistoryTable;