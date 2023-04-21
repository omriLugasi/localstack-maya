import AWS from 'aws-sdk'

const s3 = new AWS.S3({
    region: 'us-west-2',
    apiVersion: '2006-03-01',
    endpoint: 'http://localhost:4566',
    s3ForcePathStyle: true
})


const listBuckets = async () => {
    return s3.listBuckets().promise()
}


const listObjectsV2 = async (params: AWS.S3.Types.ListObjectsV2Request) => {
    return s3.listObjectsV2(params).promise()
}

const createBucket = async (params: { bucketName: string, isVersioned: boolean }) => {
    const response = await s3.createBucket({ Bucket: params.bucketName }).promise()
    if (params.isVersioned) {
        const versionedParams = {
            Bucket: params.bucketName,
            VersioningConfiguration: {
                MFADelete: "Disabled",
                Status: "Enabled"
            }
        };
        await s3.putBucketVersioning(versionedParams).promise();
    }
    return response
}

const uploadFile = async (params: AWS.S3.Types.PutObjectRequest) => {
    await s3.upload(params).promise();
}


export default {
    listBuckets,
    createBucket,
    listObjectsV2,
    uploadFile
}
