import {useContext, useEffect} from "react";
import {useParams} from 'react-router-dom'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useFieldNameHook} from "../../customHook/hookName";
import {sqsPushMessage, getSqsDetails, sqsPullMessage} from "../../api/sqs";
import {AppContext} from "../../contexts/application";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

interface IProps {
}

export const SqsQueuePage = (props: IProps) => {
    const [state, initialProps, setState] = useFieldNameHook({})
    const { queueName } = useParams();
    const appContext = useContext(AppContext)

    useEffect(() => {
        const query = async () => {
            const response = await getSqsDetails({ queueName: queueName as string , region: appContext.region})
            setState({
                target: {
                    name: 'queueAttribute',
                    value: response.Attributes
                }
            })
        }
        query()
    }, [])

    const onPushHandler = async () => {
        if (!state.pushMessageContent) {
            alert('message must contains something.')
            return
        }

        try {
            const response = await sqsPushMessage({
                messageBody: state.pushMessageContent,
                queueName: queueName as string,
                region: appContext.region
            })

            console.log(response)
            appContext.showToaster({
                type: 'success',
                message: 'Message pushed successfully'
            })
        } catch (e) {
            console.error(e)
            appContext.showToaster({
                type: 'error',
                message: 'Message failed to pushed'
            })
        }

        setState({
            target: {
                name: 'pushMessageContent',
                value: ''
            }
        })
    }

    const onPullHandler = async () => {
        const response = await sqsPullMessage({
            region: appContext.region,
            queueName: queueName as string,
            MaxNumberOfMessages: 10
        })
        setState({
            target: {
                name: 'receivedMessages',
                value: response.Messages
            }
        })
    }

    return (
        <div className='sqs-page-padding-left'>
            <h2> Send and receive messages</h2>
            <span>Send messages to and receive message from a queue ({queueName}).</span>

            <Paper className='sqs-page-paper-container'>
                <div className='flex-space-between sqs-page-padding-right sqs-page-padding-left'>
                    <h3>Send message</h3>
                    <Button
                        variant="contained"
                        onClick={onPushHandler}
                        size='small'
                        disabled={!state.pushMessageContent?.length}
                    >Push</Button>
                </div>
                <Divider />
                <p className='sqs-page-padding-left'>
                    Message body <br/>
                    <span>Enter the message to send to the queue.</span>
                </p>
                <TextField
                    style={{ width: 400, margin: 20 }}
                    label="Message"
                    multiline
                    rows={6}
                    { ...initialProps({ fieldName: 'pushMessageContent' }) }
                />
            </Paper>

            <Paper className='sqs-page-paper-container'>
                <div className='flex-space-between sqs-page-padding-right sqs-page-padding-left'>
                    <h3>Pull messages</h3>
                    <Button
                        variant="contained"
                        onClick={onPullHandler}
                        size='small'
                    >Pull messages</Button>
                </div>
                <Divider />

                <div className='pull-details-container sqs-page-padding-left'>
                    <div className='pull-details-sub-container'>
                        <div>
                            <p>Messages Available</p>
                            <p>{ parseInt(state.queueAttribute?.ApproximateNumberOfMessages  || 0) - parseInt(state.queueAttribute?.ApproximateNumberOfMessagesNotVisible || 0)}</p>
                        </div>
                        <Divider orientation={'vertical'} />
                    </div>
                    <div className='pull-details-sub-container'>
                        <div>
                            <p>Pulling Duration</p>
                            <p>{ state.queueAttribute?.VisibilityTimeout || 0}</p>
                        </div>
                        <Divider orientation={'vertical'} />
                    </div>
                    <div className='pull-details-sub-container'>
                        <div>
                            <p>Delay Seconds</p>
                            <p>{ state.queueAttribute?.DelaySeconds || 0}</p>
                        </div>
                        <Divider orientation={'vertical'} />
                    </div>
                    <div className='pull-details-sub-container'>
                        <div>
                            <p>Maximum Message Count</p>
                            <p>10</p>
                        </div>
                    </div>
                </div>

                <Divider />
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Sent</TableCell>
                            <TableCell align="left">Receive Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(state.receivedMessages || []).map((row: { MessageId: string, ReceiptHandle: string, Body: string }, index: number) => (
                            <TableRow key={row.MessageId}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                    {row.MessageId}
                                </TableCell>
                                <TableCell align="left">{new Date(parseInt(row.Attributes.SentTimestamp)).toISOString()}</TableCell>
                                <TableCell align="left">{row.Attributes.ApproximateReceiveCount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

        </div>
    )
}
