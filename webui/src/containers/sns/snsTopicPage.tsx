import {useContext, useEffect, useState} from "react";
import {useParams, useNavigate} from 'react-router-dom'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {sqsPushMessage, getSqsDetails, sqsPullMessage, sqsAckMessages, deleteSqs} from "../../api/sqs";
import {AppContext} from "../../contexts/application";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Drawer from "@mui/material/Drawer";
import Checkbox from "@mui/material/Checkbox";

type SqsMessageType = {
    MessageId: string,
    ReceiptHandle: string,
    Body: string,
    Attributes: { SentTimestamp: string, ApproximateReceiveCount: string }
}

interface IProps {
}

export const SnsTopicPage = (props: IProps) => {
    const [openedMessage, setOpenMessage] = useState<null | SqsMessageType>(null)
    const [pushMessageContent, setPushMessageContent] = useState<string>('')
    const [receivedMessages, setReceivedMessages] = useState<SqsMessageType[]>([])
    const [selectedMessages, setSelectedMessages] = useState<SqsMessageType[]>([])
    const [queueAttribute, setQueueAttribute] = useState<{
        ApproximateNumberOfMessages: string,
        VisibilityTimeout: string,
        DelaySeconds: string,
        ApproximateNumberOfMessagesNotVisible: string,
    }>({
        ApproximateNumberOfMessages: '0',
        VisibilityTimeout: '0',
        DelaySeconds: '0',
        ApproximateNumberOfMessagesNotVisible: '0',
    })

    const navigate = useNavigate();
    const { topicName } = useParams();
    const appContext = useContext(AppContext)

    useEffect(() => {
        const query = async () => {
            const response = await getSqsDetails({ queueName: queueName as string , region: appContext.region})
            setQueueAttribute(response.Attributes)
        }
        query()
    }, [])

    const onPushHandler = async () => {
        if (!pushMessageContent) {
            alert('message must contains something.')
            return
        }

        try {
            const response = await sqsPushMessage({
                messageBody: pushMessageContent,
                queueName: queueName as string,
                region: appContext.region
            })

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

        setPushMessageContent('')
    }

    const onPullHandler = async () => {
        const response = await sqsPullMessage({
            region: appContext.region,
            queueName: topicName as string,
            MaxNumberOfMessages: 10
        })
        setReceivedMessages(response.Messages || [])
        if (!response.Messages) {
            appContext.showToaster({
                type: 'success',
                message: 'Queue is empty'
            })
        }
    }

    const closeDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (((event as React.KeyboardEvent).key === 'Escape')) {
            setOpenMessage(null)
        }
    }

    const openMessageHandler = (row: SqsMessageType) => {
        setOpenMessage(row)
    }

    const ackHandler = async () => {
        if (!selectedMessages.length) {
            alert('You must select first 1 or more messages.')
        }
        try {
            await sqsAckMessages({
                region: appContext.region,
                queueName: topicName as string,
                messages: selectedMessages.map(message => ({
                    Id: message.MessageId,
                    ReceiptHandle: message.ReceiptHandle
                }))
            })
            appContext.showToaster({
                type: 'success',
                message: `${selectedMessages.length} deleted successfully`
            })

            setReceivedMessages(receivedMessages.filter(message => !selectedMessages.some(innerMessage => innerMessage.MessageId === message.MessageId)))
            setSelectedMessages([])
        } catch(e) {
            appContext.showToaster({
                type: 'error',
                message: e.response.data.message
            })
        }

    }

    const onDeleteQueue = async() => {
        try {
            await deleteSqs({
                region: appContext.region,
                queueName: topicName as string
            })
            navigate('/SNS')
            appContext.showToaster({
                type: 'success',
                message: `${topicName} deleted successfully`
            })

        } catch(e) {
            appContext.showToaster({
                type: 'error',
                message: e.response.data.message
            })
        }
    }

    const onSelectionChange = (selectedMessage: SqsMessageType) => {
        if (selectedMessages.some((message: SqsMessageType) => message.MessageId === selectedMessage.MessageId)) {
            setSelectedMessages(selectedMessages.filter((message: SqsMessageType) => message.MessageId !== selectedMessage.MessageId))
            return
        }
        setSelectedMessages([...selectedMessages, selectedMessage])
    }

    return (
        <div>
            <div className='sns-page-padding-left'>
                <h2> Send and receive messages</h2>
                <div className='sub-title-bar'>
                    <span>Send messages to and receive message from a SNS Topic ({topicName}).</span>
                    <div className='sub-title-bar-actions'>
                        <Button
                            onClick={onDeleteQueue}
                            data-qa='sns-delete-queue'
                            variant="contained"
                            size='small'
                        >Delete Queue</Button>
                    </div>
                </div>



                <Paper className='sns-page-paper-container'>
                    <div className='flex-space-between sns-page-padding-right sns-page-padding-left'>
                        <h3>Send message</h3>
                        <Button
                            data-qa='sns-push-message-button'
                            variant="contained"
                            onClick={onPushHandler}
                            size='small'
                            disabled={!pushMessageContent?.length}
                        >Push</Button>
                    </div>
                    <Divider />
                    <p className='sns-page-padding-left'>
                        Message body <br/>
                        <span>Enter the message to send to the queue.</span>
                    </p>
                    <TextField
                        inputProps={{
                            'data-qa': 'sns-push-message-input'
                        }}
                        style={{ width: '80%', margin: 20 }}
                        label="Message"
                        multiline
                        rows={10}
                        value={pushMessageContent}
                        onChange={(e) => setPushMessageContent(e.target.value)}
                    />
                </Paper>

                <Paper className='sns-page-paper-container'>
                    <div className='flex-space-between sns-page-padding-right sns-page-padding-left'>
                        <h3>Pull messages</h3>
                       <div>
                           <Button
                               data-qa='sns-pull-message-button'
                               variant="contained"
                               onClick={onPullHandler}
                               size='small'
                           >Pull messages</Button>
                           {
                               selectedMessages.length
                                   ? (
                                       <Button
                                           data-qa='sns-ack-message-button'
                                           onClick={ackHandler}
                                           variant="contained"
                                           size='small'
                                       >{`Ack (${selectedMessages.length}) selected`}</Button>
                                   ) : null

                           }
                       </div>
                    </div>
                    <Divider />

                    <div className='pull-details-container sns-page-padding-left'>
                        <div className='pull-details-sub-container'>
                            <div>
                                <p>Messages Available</p>
                                <p>{ parseInt(queueAttribute?.ApproximateNumberOfMessages || '0') - parseInt(queueAttribute?.ApproximateNumberOfMessagesNotVisible || '0')}</p>
                            </div>
                            <Divider orientation={'vertical'} />
                        </div>
                        <div className='pull-details-sub-container'>
                            <div>
                                <p>Pulling Duration</p>
                                <p>{ queueAttribute?.VisibilityTimeout || 0}</p>
                            </div>
                            <Divider orientation={'vertical'} />
                        </div>
                        <div className='pull-details-sub-container'>
                            <div>
                                <p>Delay Seconds</p>
                                <p>{ queueAttribute?.DelaySeconds || 0}</p>
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
                    {
                        !!receivedMessages.length
                            ? <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox size='small' />
                                        </TableCell>
                                        <TableCell>Index</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell align="left">Sent</TableCell>
                                        <TableCell align="left">Receive Count</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {receivedMessages.map((row: SqsMessageType, index: number) => (
                                        <TableRow key={row.MessageId}>
                                            <TableCell>
                                                <Checkbox
                                                    data-qa={`message-checkbox-${index + 1}`}
                                                    size='small' onChange={() => onSelectionChange(row)} />
                                            </TableCell>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell component="th" scope="row">
                                                <span
                                                    data-qa={`message-link-${index + 1}`}
                                                    className='link' onClick={() => openMessageHandler(row)}>{row.MessageId}</span>
                                            </TableCell>
                                            <TableCell align="left">{new Date(parseInt(row.Attributes.SentTimestamp)).toISOString()}</TableCell>
                                            <TableCell align="left">{row.Attributes.ApproximateReceiveCount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            : (
                                <>
                                    <br/>
                                    <p align='center'> Pull messages to see messages in table views! :)</p>
                                    <br/>
                                </>
                            )
                    }
                </Paper>
            </div>
            <br/>
            <br/>
            <Drawer
                anchor='right'
                open={!!openedMessage}
                onKeyDown={closeDrawer}
            >
                {
                   !!openedMessage && (
                        <div style={{ width: 400, paddingLeft: 20 }}>
                            <h2>Sns message</h2>
                            <span>
                                The following describe the message information
                            </span>
                            <h3>Message id</h3>
                            { openedMessage?.MessageId }
                            <h3>Message body</h3>
                            <span data-qa={`sns-drawer-message-body`}>{ openedMessage.Body }</span>
                            <h3>Message time</h3>
                            { new Date(parseInt(openedMessage?.Attributes.SentTimestamp)).toISOString() }
                        </div>
                    )
                }
            </Drawer>
        </div>
    )
}
