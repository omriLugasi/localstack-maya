import chai, { assert } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp)


const sqsUrl = `${process.env.HTTP_PATH}/sqs`
const sqsMessagesUrl = `${sqsUrl}/messages`

describe('Simple queue service', () => {


    const mainRegion = 'us-east-1'

    describe('create new queue', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        before(async () => {
            response = await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })

            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()
        })

        it ('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it ('should the expected response', () => {
            assert.strictEqual(response.body.response.QueueUrl, `http://localhost:4566/000000000000/${randomQueueName}`)
        })
    })

    describe('get queue details', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        let queueAttributesResponse
        before(async () => {
            response = await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion,
                    attributes: {
                        VisibilityTimeout: '12'
                    }
                })

            queueAttributesResponse = await chai.request(sqsUrl)
                .get(`/attributes/${randomQueueName}`)
                .query({ region: mainRegion })
                .send()

            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()
        })

        it ('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it ('should return 200 status code for get queue attributes', () => {
            assert.strictEqual(queueAttributesResponse.status, 200)
        })

        it ('should return the expected results for the queue attributes', () => {
            const { QueueArn, CreatedTimestamp, LastModifiedTimestamp, ...rest} = queueAttributesResponse.body.Attributes
            assert.deepEqual(rest, {
                    ApproximateNumberOfMessages: '0',
                    ApproximateNumberOfMessagesNotVisible: '0',
                    ApproximateNumberOfMessagesDelayed: '0',
                    DelaySeconds: '0',
                    MaximumMessageSize: '262144',
                    MessageRetentionPeriod: '345600',
                    ReceiveMessageWaitTimeSeconds: '0',
                    VisibilityTimeout: '12',
                    SqsManagedSseEnabled: 'false'
                }
            )
        })

    })

    describe('list all queue', () => {

        let response
        before(async () => {
            response = await chai.request(sqsUrl).get('/').send()
        })

        it('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it('should return the expected results', () => {
            assert.isArray(response.body.items)
        })
    })

    describe('list all queue with prefix', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        before(async () => {
            // create queue
            await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })

            // search for the queue
            response = await chai.request(sqsUrl).get('/').query({
                prefix: randomQueueName,
                region: mainRegion
            }).send()

            // delete queue
            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()

        })

        it('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it('should return the expected results structure', () => {
            assert.isArray(response.body.items)
        })

        it('should return the expected results length', () => {
            assert.strictEqual(response.body.items.length, 1)
        })
    })

    describe('list all queue with prefix and wrong region', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        before(async () => {
            // create queue
            await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })
            // search for the queue
            response = await chai.request(sqsUrl).get('/').query({
                prefix: randomQueueName,
                region: 'eu-central-1'
            }).send()

            // delete queue
            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()

        })

        it('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it('should return the expected results structure', () => {
            assert.isArray(response.body.items)
        })

        it('should return the expected results length', () => {
            assert.strictEqual(response.body.items.length, 0)
        })
    })

    describe('create and delete queue', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        let deleteResponse
        before(async () => {
            // create queue
            await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })
            // search for the queue
            response = await chai.request(sqsUrl).get('/').query({
                prefix: randomQueueName,
                region: mainRegion
            }).send()

            // search for the queue
            deleteResponse = await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()

        })

        it('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it('should return the expected results structure', () => {
            assert.isArray(response.body.items)
        })

        it('should return the expected results length', () => {
            assert.strictEqual(response.body.items.length, 1)
        })

        it('should return 200 status code to delete request', () => {
            assert.strictEqual(deleteResponse.status, 200)
        })

    })

    describe('Purge queue', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        let creationResponse
        before(async () => {
            creationResponse = await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })

            response = await chai.request(sqsUrl)
                .post('/purge')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })

            // delete queue
            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()
        })

        it ('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

    })

    describe('create and try to delete queue on other region', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        let deleteResponse
        before(async () => {
            // create queue
            await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })
            // search for the queue
            response = await chai.request(sqsUrl).get('/').query({
                prefix: randomQueueName,
                region: mainRegion
            }).send()

            // delete the queue
            deleteResponse = await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: 'eu-central-1'
            }).send()

            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()


        })

        it('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it('should return the expected results structure', () => {
            assert.isArray(response.body.items)
        })

        it('should return the expected results length', () => {
            assert.strictEqual(response.body.items.length, 1)
        })

        it('should return 400 status code to delete request', () => {
            assert.strictEqual(deleteResponse.status, 400)
        })

        it('should return error message to delete request with wrong region', () => {
            assert.strictEqual(deleteResponse.text, '"The specified queue does not exist for this wsdl version."')
        })

    })

    describe('Create queue and set a message in the queue', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        let messageResponse
        before(async () => {
            // create queue
            await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })
            // search for the queue
            response = await chai.request(sqsUrl).get('/').query({
                prefix: randomQueueName,
                region: mainRegion
            }).send()

            // push message into queue
            messageResponse = await chai.request(sqsMessagesUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion,
                    messageBody: 'this is sparta'
                })

            // delete queue by queue name
            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()
        })

        it('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it('should return 200 status code', () => {
            assert.strictEqual(messageResponse.status, 200)
        })
    })

    describe('Create queue, set a message and get message from the queue', () => {
        const randomQueueName = Math.random().toString(16).substring(2, 8)
        let response
        let postMessageResponse
        let getMessageResponse
        before(async () => {
            // create queue
            await chai.request(sqsUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion
                })
            // search for the queue
            response = await chai.request(sqsUrl).get('/').query({
                prefix: randomQueueName,
                region: mainRegion
            }).send()

            // push message into queue
            postMessageResponse = await chai.request(sqsMessagesUrl)
                .post('/')
                .send({
                    queueName: randomQueueName,
                    region: mainRegion,
                    messageBody: 'this is sparta'
                })

            getMessageResponse = await chai.request(sqsMessagesUrl).get('/').query({
                queueName: randomQueueName,
                region: mainRegion,
                MaxNumberOfMessages: 1
            }).send()

            // delete queue by queue name
            await chai.request(sqsUrl).delete('/').query({
                queueName: randomQueueName,
                region: mainRegion
            }).send()

        })

        it('should return 200 status code', () => {
            assert.strictEqual(response.status, 200)
        })

        it('should return 200 status code', () => {
            assert.strictEqual(postMessageResponse.status, 200)
        })

        it('should return 200 status code', () => {
            assert.strictEqual(getMessageResponse.status, 200)
        })

        it('should returns the right response (messages array)', () => {
            assert.isArray(getMessageResponse.body.Messages)
        })

        it('should returns the right response (messages array of objects)', () => {
            assert.isObject(getMessageResponse.body.Messages[0])
        })
    })

})
