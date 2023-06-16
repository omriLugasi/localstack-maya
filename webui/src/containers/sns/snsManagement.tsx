import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { getTopics, SNSType } from './../../api/sns'
import Button from "@mui/material/Button";
import {CreateNewSns} from "./createNewSns";
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

export const SnsManagement = (props: IProps) => {
    const [showCreateNewSns, setShowCreateNewSns] = useState<boolean>(false)
    const [items, setItems] = useState<SNSType[]>([])
    const [totalItemCount, setTotalItemCount] = useState<number>(0)
    const [searchDebounceValue, searchActualValue, setSearchValue] = useDebounce(250)
    const navigate = useNavigate()
    const appContext = useContext(AppContext)

    const fetchSns = async () => {
        try {
            const response = await getTopics({ prefix: searchActualValue, region: appContext.region })
            setTotalItemCount(response.length)
            response.length = response.length > 8 ? 8 : response.length
            setItems(response)
        } catch (e) {
          console.error(e)
        }
    }

    useEffect(() => {
        fetchSns()
    }, [searchActualValue, appContext.region])

    return (
        <div className={'flex-center'}>
            <div style={{ width: '90%', marginBottom: '2%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <h1 style={{textTransform: 'uppercase'}}> Simple Notification Service</h1>
                    <FormControl sx={{ width: '450px' }}>
                        <TextField
                            inputProps={{
                                'data-qa': 'search-sns-queue-by-name'
                            }}
                            fullWidth
                            label="Search for tpoic name"
                            variant="standard"
                            value={searchDebounceValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </FormControl>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button
                        data-qa='button-show-create-sns-dialog'
                        onClick={() => {
                            setShowCreateNewSns(true)
                        }}
                        variant="contained"
                        size={'small'}>
                        Create new sns
                    </Button>
                </div>
            </div>
            <TableContainer component={Paper} style={{ width: '92%'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Topic Name</TableCell>
                        <TableCell>Topic Arn</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Subscriptions Confirmed</TableCell>
                        <TableCell>Subscriptions Deleted</TableCell>
                        <TableCell>Subscriptions Pending</TableCell>
                        <TableCell>Policy</TableCell>
                        <TableCell>Delivery Policy</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <span
                                    data-qa={`sns-queue-column-name-${row.name}`}
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => navigate(`/SNS/topic/${row.name}`)}>
                                    {row.name}
                                </span>
                            </TableCell>
                            <TableCell>
                                {row.arn}
                            </TableCell>
                            <TableCell>
                                {row.owner}
                            </TableCell>
                            <TableCell>
                                {row.subscriptionsConfirmed}
                            </TableCell>
                            <TableCell>
                                {row.subscriptionsDeleted}
                            </TableCell>
                            <TableCell>
                                {row.subscriptionsPending}
                            </TableCell>
                            <TableCell>
                                {row.policy}
                            </TableCell>
                            <TableCell>
                                {row.deliveryPolicy}
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
                showCreateNewSns && <CreateNewSns
                  onClose={() => {
                      setShowCreateNewSns(false)
                  }}
                  onCreatedSuccessfully={fetchSns}
                />
            }
        </div>
    )
}
