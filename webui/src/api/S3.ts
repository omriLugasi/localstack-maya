
import API from './index'


export const S3GetBuckets = async (params: { search: string }) => {
    const response = await API.get('/s3', { params: {
            Search: params.search
        } })
    return response.data
}
