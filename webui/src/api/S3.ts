import type { S3 } from 'aws-sdk'
import API from './index'


export const S3GetBuckets = async (params: { search: string }) => {
    const response = await API.get('/s3', { params: {
            Search: params.search
        } })
    return response.data
}

export const s3GetBucketFiles = async (params: { bucketName: string }): Promise<S3.Types.ListObjectsV2Output> => {
    const requestParams: S3.Types.ListObjectsV2Request = {
        Bucket: params.bucketName,
    }
    const response = await API.get('/s3/files', { params: requestParams })
    return response.data
}
