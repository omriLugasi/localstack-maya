import {useParams} from 'react-router-dom'
import {useEffect} from "react";
import {getSqsDetails} from "./sqs";

interface IProps {
    region?: string
}

export const SqsQueuePage = (props: IProps) => {
    const { queueName } = useParams();

    useEffect(() => {
        getSqsDetails({ queueName })
    })

    return (
        <div>
            <h1> Start working on {queueName}</h1>
        </div>
    )
}
