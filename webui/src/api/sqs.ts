const endpoint = 'http://localhost:3232/dynamic/'
const apiVersion = '2012-11-05'

export const getSqses = async (params: { region: string, prefix: string }): Promise<{ Attributes: Record<string, string>, QueueName: string, QueueFullName: string }[]> => {
    const sqsParams = {
        QueueNamePrefix: params.prefix || ''
    }
    const sqs = new window.AWS.SQS({
        apiVersion,
        endpoint,
        region: params.region
    })
    const response = await sqs.listQueues(sqsParams).promise();

    const queues: { Attributes: Record<string, string>, QueueName: string }[] = []
    if (Array.isArray(response?.QueueUrls)) {
        for (const queueName of response?.QueueUrls) {
            const sqsParams = {
                QueueUrl: queueName,
                AttributeNames: ['All']
            }
            const response = await sqs.getQueueAttributes(sqsParams).promise();
            const nameSplitedArr = queueName.split('/')
            queues.push({
                QueueName: nameSplitedArr[nameSplitedArr.length - 1],
                QueueFullName: queueName,
                Attributes: response.Attributes
            })
        }
    }

    return queues
}

export const createSqs = async (params: { region: string, queueName: string, attributes: Record<string, unknown>, tags: Record<string, unknown> }) => {
    const { region, queueName, attributes, tags } = params
    const sqsParams = {
        Attributes: attributes,
        tags,
        QueueName: queueName,
    }
    const sqs = new window.AWS.SQS({
        apiVersion,
        endpoint,
        region: params.region
    })
    return sqs.createQueue(sqsParams).promise();
}

export const deleteSqs = async (params: { region: string, queueName: string } ) => {
    const sqs = new window.AWS.SQS({
        apiVersion,
        endpoint,
        region: params.region
    })

    const sqses = await getSqses({region: params.region, prefix: params.queueName})

    const sqsParams = {
        QueueUrl: sqses[0].QueueFullName
    }
    return sqs.deleteQueue(sqsParams).promise();
}

export const getSqsDetails = async (params: { queueName: string, region: string }) => {
    const sqs = new window.AWS.SQS({
        apiVersion,
        endpoint,
        region: params.region
    })

    const sqses = await getSqses({region: params.region, prefix: params.queueName})
    const sqsParams = {
        QueueUrl: sqses[0].QueueFullName,
        AttributeNames: ['All']
    }
    return sqs.getQueueAttributes(sqsParams).promise();
}

export const sqsPushMessage = async (params: { region: string, queueName: string, messageBody: unknown }) => {
    const sqs = new window.AWS.SQS({
        apiVersion,
        endpoint,
        region: params.region
    })

    const sqses = await getSqses({region: params.region, prefix: params.queueName})

    const sqsParams = {
        MessageBody: params.messageBody,
        QueueUrl: sqses[0].QueueFullName,
    }
    return sqs.sendMessage(sqsParams).promise();
}

export const sqsPullMessage = async (params: { region: string, queueName: string, [key: string]: string | number }) => {
    const {region, queueName, ...rest} = params
    const sqs = new window.AWS.SQS({
        apiVersion,
        endpoint,
        region
    })

    const sqses = await getSqses({ region, prefix: queueName })
    const sqsParams = {
        ...rest,
        QueueUrl: sqses[0].QueueFullName,
        AttributeNames: ['All'],
    }
    return sqs.receiveMessage(sqsParams).promise();
}

export const sqsAckMessages = async (params: { region: string, queueName: string, messages: { Id: string, ReceiptHandle: string}[] }) => {

    const { region, queueName, messages } = params

    const sqs = new window.AWS.SQS({
        apiVersion,
        endpoint,
        region
    })

    const sqses = await getSqses({ region, prefix: queueName })

    const sqsParams = {
        Entries: messages,
        QueueUrl: sqses[0].QueueFullName,
    }
    return sqs.deleteMessageBatch(sqsParams).promise();
}
