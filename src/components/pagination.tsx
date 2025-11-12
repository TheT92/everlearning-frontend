interface Props {
    className?: string;
    data?: {
        currentPage: number;
        total: number;
    }
    onPageChange?: (page: number) => void;
}

export default function Pagination({
    className = "",
    data = { currentPage: 0, total: 0 },
    onPageChange = () => {}
}: Props) {
    
    const onclick = (page: number) => () => {
        onPageChange(page);
    }

    return (
        <div className={`el-pagination ${className}`}>
            <button className="el-page-btn">Previous</button>
            {
                Array.from({ length: Math.ceil(data.total / 10) }, (_, index) => (
                    <button onClick={onclick(index + 1)} key={index} className="el-page-number">{index + 1}</button>
                ))

            }
            <span className="el-page-info">Page {data.currentPage <= 0 ? 1 : data.currentPage} of 10</span>
            <button className="el-page-btn">Next</button>
        </div>
    );
}