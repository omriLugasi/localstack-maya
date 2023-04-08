
import API from './index'


export const getSqses = async (params: { prefix: string }) => {
    const response = await API.get('/sqs', { params: {
        ...params, region: window.region
        } })
    return response.data
}

export const createSqs = async (params: { queueName: string, attributes: Record<string, unknown>, tags: Record<string, unknown> }) => {
    const response = await API.post('/sqs', {
        ...params,
        region: window.region
    })
    return response.data
}

export const getSqsDetails = async (params: { queueName: string }) => {
    const response = await API.get(`/sqs/attributes/${params.queueName}`, {
        params: { region: window.region }
    })
    return response.data
}
