
interface IProps {
    style?: Record<string, string>
    tbodyStyle?: Record<string, string>
    headers: {
        key: string,
        display?: string,
        style?: Record<string, string>
        hyperLink?: (value: unknown) => void
    }[],
    rows: Record<string, string>[]
}

export const Table = (props: IProps) => {

    return (
        <table style={props.style}>
            <thead>
            <tr>
                {
                    props.headers.map(header => (
                        <th key={header.key}>{header.display || header.key}</th>
                    ))
                }
            </tr>
            </thead>
            <tbody style={props.tbodyStyle}>
            {
                props.rows.map(row => (
                    <tr>
                        {
                            props.headers.map(header => (
                                <td>
                                    <p style={header.style} onClick={() => {
                                        header.hyperLink?.(row[header.key])
                                    }}> <u>{row[header.key]}</u> </p>
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
            </tbody>
        </table>
    )
}
