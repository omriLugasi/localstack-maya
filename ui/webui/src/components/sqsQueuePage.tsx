import {useParams} from 'react-router-dom'
import {useContext, useEffect} from "react";
import TextField from "@mui/material/TextField";
import {useFieldNameHook} from "../customHook/hookName";
import Button from "@mui/material/Button";
import {sqsPushMessage, getSqsDetails} from "../api/sqs";
import {AppContext} from "../contexts/application";

interface IProps {
    region?: string
}

export const SqsQueuePage = (props: IProps) => {
    const [state, initialProps, setState] = useFieldNameHook({})
    const { queueName } = useParams();
    const appContext = useContext(AppContext)

    useEffect(() => {
        getSqsDetails({ queueName })
    }, [])

    const onPushHandler = async () => {
        if (!state.pushMessageContent) {
            alert('message must contains something.')
            return
        }

        try {
            const response = await sqsPushMessage({
                messageBody: state.pushMessageContent,
                queueName: queueName as string
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

    return (
        <div>
            <h2> Start working on {queueName}</h2>

            <TextField
                label="Message"
                multiline
                rows={4}
                { ...initialProps({ fieldName: 'pushMessageContent' }) }
            />
            <Button variant="contained" onClick={onPushHandler} size='small'>Push</Button>
        </div>
    )
}
