
import API from './index'


export const getSqses = async (params: { prefix: string }) => {
    const response = await API.get('/sqs', { params })
    return response.data
}

export const createSqs = async (params: { queueName: string, attributes: Record<string, unknown>, tags: Record<string, unknown> }) => {
    const response = await API.post('/sqs', params)
    return response.data
}
