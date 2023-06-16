import {CreateTopicInput} from "aws-sdk/clients/sns";

const endpoint = 'http://localhost:3232/dynamic/'
const apiVersion = '2012-11-05'

export type SNSType = {
    arn?: string,
    name?: string,
    owner?: string,
    subscriptionsConfirmed?: string,
    subscriptionsDeleted?: string,
    subscriptionsPending?: string,
    policy?: string,
    deliveryPolicy?: string,
}


export const getTopics = async (params: { region: string, prefix: string }): Promise<SNSType[]> => {
    const sqsParams = {
        QueueNamePrefix: params.prefix || ''
    }
    const sns = new window.AWS.SNS({
        apiVersion,
        endpoint,
        region: params.region
    })
    const response = await sns.listTopics().promise();

    const topics: SNSType[] = []
    if (Array.isArray(response?.Topics)) {
        for (const topic of response?.Topics) {
            const details = await sns.getTopicAttributes(topic).promise()
            console.log(details)
            const arr = topic?.TopicArn?.split(':')
            topics.push({
                arn: topic?.TopicArn,
                name: details.Attributes?.DisplayName ? details.Attributes?.DisplayName : (arr && arr[arr.length - 1]),
                owner: details.Attributes?.Owner,
                subscriptionsConfirmed: details.Attributes?.SubscriptionsConfirmed,
                subscriptionsDeleted: details.Attributes?.SubscriptionsDeleted,
                subscriptionsPending: details.Attributes?.SubscriptionsPending,
                policy: details.Attributes?.Policy,
                deliveryPolicy: details.Attributes?.DeliveryPolicy,
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
