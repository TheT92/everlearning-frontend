interface Props {
    className?: string;
    children: React.ReactNode;
    outlined?: boolean;
    size?: 'sm' | 'md' | 'lg';
    type?: "button" | "submit" | "reset";
}

export default function Button({
    className = "",
    children,
    outlined = false,
    size= 'md',
    type = "button"
}: Props) {
    return (
        <button type={type} className={`el-btn ${`el-btn-`+size} ${outlined ? 'el-btn-outline' : ''} ${className}`}>{children}</button>
    );
}