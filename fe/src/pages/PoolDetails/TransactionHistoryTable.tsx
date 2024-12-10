import { Empty } from 'antd';
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
    const totalPages = Math.ceil(total / 20); 
    return (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Sender</th>
                <th>Block Number</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              ) : transactionHistories.length > 0 ? (
                transactionHistories.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td>{tx.type}</td>
                    <td>{tx.sender}</td>
                    <td>{tx.blockNumber}</td>
                    <td>{new Date(Number(tx.timestamp) * 1000).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div style={{ marginTop: "10px" }}>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageIndex = index + 1;
              return (
                <button
                  key={pageIndex}
                  onClick={() => onPageChange && onPageChange(pageIndex)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor: pageIndex === page ? "#007bff" : "#f8f9fa",
                    color: pageIndex === page ? "#fff" : "#000",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                >
                  {pageIndex}
                </button>
              );
            })}
          </div>
        </div>
      );
}

export default TransactionHistoryTable;