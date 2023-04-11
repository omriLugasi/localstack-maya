import {useContext, useEffect} from "react";
import {useParams} from 'react-router-dom'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useFieldNameHook} from "../../customHook/hookName";
import {sqsPushMessage, getSqsDetails, sqsPullMessage} from "../../api/sqs";
import {AppContext} from "../../contexts/application";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";

interface IProps {
}

export const SqsQueuePage = (props: IProps) => {
    const [state, initialProps, setState] = useFieldNameHook({})
    const { queueName } = useParams();
    const appContext = useContext(AppContext)

    useEffect(() => {
        getSqsDetails({ queueName: queueName as string , region: appContext.region})
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
            queueName: queueName as string
        })
        console.log(response)
    }

    return (
        <div style={{  paddingLeft: 20 }}>
            <h2> Send and receive messages</h2>
            <span>Send messages to and receive message from a queue ({queueName}).</span>

            <Paper style={{ width: '90%' }}>
                <div className='flex-space-between' style={{  paddingLeft: 20, paddingRight: 20  }}>
                    <h3>Send message</h3>
                    <Button
                        variant="contained"
                        onClick={onPushHandler}
                        size='small'
                        disabled={!state.pushMessageContent?.length}
                    >Push</Button>
                </div>
                <Divider />
                <p style={{  paddingLeft: 20 }}>
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
            <Button
                variant="contained"
                onClick={onPullHandler}
                size='small'
            >Pull message</Button>
        </div>
    )
}
