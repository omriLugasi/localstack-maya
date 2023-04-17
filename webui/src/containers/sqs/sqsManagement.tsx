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
import useDebounce from "../../customHook/useDebounce";

interface IProps {
}

export const SqsManagement = (props: IProps) => {
    const [showCreateNewSqs, setShowCreateNewSqs] = useState<boolean>(false)
    const [items, setItems] = useState<{ Attributes: Record<string, string>, QueueName: string }[]>([])
    const [totalItemCount, setTotalItemCount] = useState<number>(0)
    const [searchDebounceValue, searchActualValue, setSearchValue] = useDebounce(250)
    const navigate = useNavigate()
    const appContext = useContext(AppContext)

    const fetchSqs = async () => {
        try {
            const response = await getSqses({ prefix: searchActualValue, region: appContext.region })
            setTotalItemCount(response.Items.length)
            response.Items.length = 8
            setItems(response.Items)
        } catch (e) {
          console.error(e)
        }
    }

    useEffect(() => {
        fetchSqs()
    }, [searchActualValue, appContext.region])

    return (
        <div className={'flex-center'}>
            <div style={{ width: '90%', marginBottom: '2%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <h1 style={{textTransform: 'uppercase'}}> Simple Queue Service</h1>
                    <FormControl sx={{ width: '450px' }}>
                        <TextField
                            inputProps={{
                                'data-qa': 'search-sqs-queue-by-name'
                            }}
                            fullWidth
                            label="Search for queue name"
                            variant="standard"
                            value={searchDebounceValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </FormControl>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button
                        data-qa='button-show-create-sqs-dialog'
                        onClick={() => {
                            setShowCreateNewSqs(true)
                        }}
                        variant="contained"
                        size={'small'}>
                        Create new Sqs
                    </Button>
                </div>
            </div>
            <TableContainer component={Paper} style={{ width: '92%'}}>
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
                            key={row.QueueName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <span
                                    data-qa={`sqs-queue-column-name-${row.QueueName}`}
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => navigate(`/SQS/queue/${row.QueueName}`)}>
                                    {row.QueueName}
                                </span>
                            </TableCell>
                            <TableCell>
                                {row.Attributes.ApproximateNumberOfMessages}
                            </TableCell>
                            <TableCell>
                                {row.Attributes.MaximumMessageSize}
                            </TableCell>
                            <TableCell>
                                {row.Attributes.VisibilityTimeout}
                            </TableCell>
                            <TableCell>
                                {new Date(parseInt(row.Attributes.CreatedTimestamp) * 1000).toISOString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            {
                totalItemCount > 8 ? <p> Display 8 from { totalItemCount } results. </p> : null
            }
            {
                showCreateNewSqs && <CreateNewSqs
                  onClose={() => {
                      setShowCreateNewSqs(false)
                  }}
                  onCreatedSuccessfully={fetchSqs}
                />
            }
        </div>
    )
}
