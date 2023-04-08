import {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { getSqses } from './../../api/sqs'
import {Table} from "../../components/table";
import Button from "@mui/material/Button";
import {CreateNewSqs} from "./createNewSqs";

interface IProps {
    region?: string
}

export const SqsManagement = (props: IProps) => {
    const [searchValue, setSearchValue] = useState<string>('')
    const [showCreateNewSqs, setShowCreateNewSqs] = useState<boolean>(false)
    const [items, setItems] = useState<Record<string, string>[]>([])

    const fetchSqs = async () => {
        try {
            const response = await getSqses({ prefix: searchValue })
            setItems(response.items.map((itemName: string) => ({
                queueName: itemName
            })))
        } catch (e) {
          console.error(e)
        }
    }

    useEffect(() => {
        fetchSqs()
    }, [searchValue, props.region])

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
            <Button
                onClick={() => {
                    setShowCreateNewSqs(true)
                }}
                variant="outlined" size={'small'}>Create new Sqs</Button>
            <CreateNewSqs
                display={showCreateNewSqs}
                onClose={() => {
                    setShowCreateNewSqs(false)
                }}
                onCreatedSuccessfully={fetchSqs}
            />
            <Table
                style={{ width: '800px' }}
                tbodyStyle={{ height: '300px', width: '800px', overflow: 'auto', display: 'block' }}
                headers={[
                    {
                        key: 'queueName',
                        display: 'Queue Name',
                        style: { color: 'blue', cursor: 'pointer' }
                    }
                ]}
                rows={items}
            />

        </div>
    )
}
