import type { S3 } from 'aws-sdk'
import API from './index'


export const s3 = new window.AWS.S3({
    region: 'us-east-1',
    apiVersion: '2006-03-01',
    endpoint: 'http://localhost:3232/dynamic',
    s3ForcePathStyle: true
})


export const S3GetBuckets = async (params: { search: string }) => {
    const response = await API.get('/s3', { params: {
            Search: params.search
        } })
    return response.data
}

export const s3GetBucketFiles = async (params: { bucketName: string, prefix: string }): Promise<S3.Types.ListObjectsV2Output> => {
    const requestParams: S3.Types.ListObjectsV2Request = {
        Bucket: params.bucketName,
        Prefix: params.prefix
    }
    const response = await API.get('/s3/files', { params: requestParams })
    return response.data
}

export const s3UploadFile = async (params: { bucketName: string, file: unknown, path: string }): Promise<S3.Types.ListObjectsV2Output> => {
    const formData = new FormData();

    formData.append("BucketName", params.bucketName)
    formData.append("File", params.file as Blob)
    formData.append("Path", params.path)
    const response = await API.post('/s3/files', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export const s3DynamicAction = async (data: Record<string, unknown>) => {

    const response = await API.post('/s3/files/dynamic', data)
    return response.data
}

export const createBucket = async (params: {IsVersioned: boolean, createBucketParams: S3.Types.CreateBucketRequest, versioningParams?: S3.Types.PutBucketVersioningRequest}) => {
    const { IsVersioned, createBucketParams, versioningParams } = params
    const response = await s3.createBucket(createBucketParams).promise()
    if (IsVersioned && versioningParams) {
        await s3.putBucketVersioning(versioningParams).promise()
    }
    return response
}
