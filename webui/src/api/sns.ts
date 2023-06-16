import {CreateTopicInput} from "aws-sdk/clients/sns";

const endpoint = 'http://localhost:3232/dynamic/'
const apiVersion = '2012-11-05'

export const getTopics = async (params: { region: string, prefix: string }): Promise<{ arn?: string, name?: string }[]> => {
    const sqsParams = {
        QueueNamePrefix: params.prefix || ''
    }
    const sns = new window.AWS.SNS({
        apiVersion,
        endpoint,
        region: params.region
    })
    const response = await sns.listTopics().promise();

    const topics: { arn?: string, name?: string }[] = []
    if (Array.isArray(response?.Topics)) {
        for (const topic of response?.Topics) {
            const arr = topic?.TopicArn?.split(':')
            topics.push({
                arn: topic?.TopicArn,
                name: arr && arr[arr.length - 1]
            })
        }
    }

    return topics
}


export const createSns = async (params: { region: string, topicName: string, attributes: Record<string, unknown>, tags: Record<string, unknown> }) => {
    const { topicName, region, attributes, tags } = params
    const sns = new window.AWS.SNS({
        apiVersion,
        endpoint,
        region: region
    })

    return sns.createTopic({
        Name: topicName,
        Attributes: attributes,
        Tags: tags,
    }).promise()
}
