import {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { getSqses } from './../../api/sqs'

interface IProps {

}

export const SqsSearch = (props: IProps) => {
    const [searchValue, setSearchValue] = useState<string>('')
    const [items, setItems] = useState<string[]>([])

    useEffect(() => {
        getSqses({ prefix: searchValue }).then(result => {
            setItems(result.items)
        })
    }, [searchValue])

    return (
        <div>
            <h1> Simple Queue Service</h1>
            <FormControl sx={{ width: '450px' }}>
            <TextField
                fullWidth
                label="Search for queue name"
                variant="standard"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            </FormControl>
            <table style={{ width: '800px' }}>
                <thead>
                  <tr>
                      <th> Queue name </th>
                  </tr>
                </thead>
                <tbody style={{ height: '300px', width: '800px', overflow: 'auto', display: 'block' }}>
                {
                    items.map((item: string) => {
                        return (
                            <tr key={item} style={{ display: 'table', width: '800px'  }}>
                                <td>
                                    <a style={{ color: 'blue', cursor: 'pointer' }}> <u>{item}</u> </a>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>

        </div>
    )
}
