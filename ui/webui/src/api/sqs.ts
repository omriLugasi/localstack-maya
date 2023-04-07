
import API from './index'


export const getSqses = async (params: { prefix: string }) => {
    const response = await API.get('/sqs', { params })
    return response.data
}
