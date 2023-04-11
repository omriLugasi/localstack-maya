import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { getSqses } from './../../api/sqs'
import Button from "@mui/material/Button";
import {CreateNewSqs} from "./createNewSqs";
import {AppContext} from "../../contexts/application";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

interface IProps {
}

export const SqsManagement = (props: IProps) => {
    const [searchValue, setSearchValue] = useState<string>('')
    const [showCreateNewSqs, setShowCreateNewSqs] = useState<boolean>(false)
    const [items, setItems] = useState<{ attributes: Record<string, string>, queueName: string }[]>([])
    const [totalItemCount, setTotalItemCount] = useState<number>(0)
    const navigate = useNavigate()
    const appContext = useContext(AppContext)

    const fetchSqs = async () => {
        try {
            const response = await getSqses({ prefix: searchValue, region: appContext.region })
            setTotalItemCount(response.items.length)
            response.items.length = 8
            setItems(response.items)
        } catch (e) {
          console.error(e)
        }
    }

    useEffect(() => {
        fetchSqs()
    }, [searchValue, appContext.region])

    return (
        <div className={'flex-center'}>
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
            {
                showCreateNewSqs && <CreateNewSqs
                  onClose={() => {
                      setShowCreateNewSqs(false)
                  }}
                  onCreatedSuccessfully={fetchSqs}
                />
            }
            <TableContainer component={Paper} style={{ width: '75%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Queue name</TableCell>
                        <TableCell>~ Messages in queue</TableCell>
                        <TableCell>Max message size</TableCell>
                        <TableCell>Visibility timeout</TableCell>
                        <TableCell>Created at</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row) => (
                        <TableRow
                            key={row.queueName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <span
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => navigate(`/SQS/queue/${row.queueName}`)}>
                                    {row.queueName}
                                </span>
                            </TableCell>
                            <TableCell>
                                {row.attributes.ApproximateNumberOfMessages}
                            </TableCell>
                            <TableCell>
                                {row.attributes.MaximumMessageSize}
                            </TableCell>
                            <TableCell>
                                {row.attributes.VisibilityTimeout}
                            </TableCell>
                            <TableCell>
                                {new Date(parseInt(row.attributes.CreatedTimestamp) * 1000).toISOString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            {
                totalItemCount > 8 ? <p> Display 8 from { totalItemCount } results. </p> : null
            }
        </div>
    )
}
