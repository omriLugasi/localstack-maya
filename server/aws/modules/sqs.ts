import AWS from 'aws-sdk'

const getQueueDetailsByName = async (params: { region: string, queueName: string }) => {
    const sqsParams = {
        QueueUrl: `http://localhost:4566/000000000000/${params.queueName}`,
        AttributeNames: ['All']
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
    });
    return sqs.getQueueAttributes(sqsParams).promise();
}

const listQueues = async (params: { region: string, prefix: string }) => {
    const sqsParams = {
        QueueNamePrefix: params.prefix
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
    });
    const response = await sqs.listQueues(sqsParams).promise();
    return (response?.QueueUrls || []).map((url: string) => url.replace('http://localhost:4566/000000000000/', ''))
}

const createQueue = async (params: { region: string, queueName: string, attributes: AWS.SQS.Types.CreateQueueRequest['Attributes'], tags: AWS.SQS.Types.CreateQueueRequest['tags'] }) => {
    const { region, queueName, attributes, tags } = params
    const sqsParams = {
        Attributes: attributes,
        tags,
        QueueName: queueName,
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: region
    });
    return sqs.createQueue(sqsParams).promise();
}

const deleteQueue = async (params: { region: string, queueName: string }) => {
    const sqsParams = {
        QueueUrl: `http://localhost:4566/000000000000/${params.queueName}`
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
    });
    return sqs.deleteQueue(sqsParams).promise();
}

const purgeQueue = async (params: { region: string, queueName: string }) => {
    const sqsParams = {
        QueueUrl: `http://localhost:4566/000000000000/${params.queueName}`
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
    });
    return sqs.purgeQueue(sqsParams).promise();
}


const getQueueMessages = async (params: { region: string, queueName: string } & AWS.SQS.Types.ReceiveMessageRequest) => {
    const { region, queueName, QueueUrl, ...restParams } = params
    const sqsParams = {
        QueueUrl: `http://localhost:4566/000000000000/${params.queueName}`,
        ...restParams
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
    });
    return sqs.receiveMessage(sqsParams).promise();
}

const postQueueMessages = async (params: { region: string, queueName: string } & AWS.SQS.Types.SendMessageRequest) => {
    const { region, queueName, ...restParams } = params
    const sqsParams = {
        ...restParams,
        QueueUrl: `http://localhost:4566/000000000000/${params.queueName}`,
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
    });
    return sqs.sendMessage(sqsParams).promise();
}



export default {
    listQueues,
    createQueue,
    deleteQueue,
    getQueueMessages,
    postQueueMessages,
    purgeQueue,
    getQueueDetailsByName,
}
