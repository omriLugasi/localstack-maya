import type { S3 } from 'aws-sdk'
import type {Bucket} from 'aws-sdk/clients/s3'


export const s3 = new window.AWS.S3({
    region: 'us-west-2',
    apiVersion: '2006-03-01',
    endpoint: 'http://localhost:3232/dynamic',
    s3ForcePathStyle: true
})


export const S3GetBuckets = async (params: { search: string }): Promise<{ Items: Bucket[] }> => {
    const { Buckets } = await s3.listBuckets().promise()
    return { Items: (Buckets || []) }
}

export const s3GetBucketFiles = async (params: S3.Types.ListObjectsV2Request): Promise<S3.Types.ListObjectsV2Output> => {
    const response = await s3.listObjectsV2(params).promise()
    return response
}

export const s3UploadFile = async (params: { bucketName: string, file: unknown, path: string }): Promise<S3.Types.ManagedUpload.SendData> => {
    const xPramas = {
        Bucket: params.bucketName,
        Body: params.file as Blob,
        Key: params.path,
        ContentType: params.file.mimeType,
        ContentLength: params.file.size
    }

    return s3.upload(xPramas).promise();
}

export const createBucket = async (params: {IsVersioned: boolean, createBucketParams: S3.Types.CreateBucketRequest, versioningParams?: S3.Types.PutBucketVersioningRequest}) => {
    const { IsVersioned, createBucketParams, versioningParams } = params
    const response = await s3.createBucket(createBucketParams).promise()
    if (IsVersioned && versioningParams) {
        await s3.putBucketVersioning(versioningParams).promise()
    }
    return response
}
