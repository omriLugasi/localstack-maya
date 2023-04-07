import AWS from 'aws-sdk'

const listQueues = async (params: { region: string, prefix: string }) => {
    const sqsParams = {
        QueueNamePrefix: params.prefix
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
    });
    return sqs.listQueues(sqsParams).promise();
}

const createQueue = async (params: { region: string, queueName: string, delaySeconds?: number, messageRetentionPeriod?: number }) => {
    const sqsParams = {
        QueueName: params.queueName,
        DelaySeconds: params.delaySeconds,
        MessageRetentionPeriod: params.messageRetentionPeriod
    }
    const sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566',
        region: params.region
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
}
