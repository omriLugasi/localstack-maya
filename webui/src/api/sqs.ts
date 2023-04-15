
import API from './index'


export const getSqses = async (params: { region: string, prefix: string }) => {
    const response = await API.get('/sqs', { params: {
        ...params, region: params.region
        } })
    return response.data
}

export const createSqs = async (params: { region: string, queueName: string, attributes: Record<string, unknown>, tags: Record<string, unknown> }) => {
    const response = await API.post('/sqs', {
        ...params,
        region: params.region
    })
    return response.data
}

export const getSqsDetails = async (params: { queueName: string, region: string }) => {
    const response = await API.get(`/sqs/attributes/${params.queueName}`, {
        params: { region: params.region }
    })
    return response.data
}

export const sqsPushMessage = async (params: { region: string, queueName: string, messageBody: unknown }) => {
    const response = await API.post(`/sqs/messages`, {
        queueName: params.queueName,
        messageBody: params.messageBody,
        region: params.region
    })
    return response.data
}

export const sqsPullMessage = async (params: { region: string, queueName: string, [key: string]: string | number }) => {
    const response = await API.get(`/sqs/messages`, {
        params
    })
    return response.data
}

export const sqsAckMessages = async (params: { region: string, queueName: string, messages: { Id: string, ReceiptHandle: string}[] }) => {
    const response = await API.post(`/sqs/messages/ack`, {
        Region: params.region,
        QueueName: params.queueName,
        Messages: params.messages
    })
    return response.data
}
