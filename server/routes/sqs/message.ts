import Route from 'express'
import sqsModule from './../../aws/modules/sqs'


const route = Route()


route.get('/', async (req, res) => {
    const response = await sqsModule.getQueueMessages({
        region: req.query.region || 'us-east-1',
        queueName: req.query.queueName,
        // it's just hack for now, we override it inside the getQueueMessages with the queue name
        QueueUrl: ''
    })
    res.send({
        items: response
    })
})

route.post('/', async (req, res) => {
    const response = await sqsModule.postQueueMessages({
        region: req.body.region || 'us-east-1',
        queueName: req.body.queueName,
        MessageBody: req.body.messageBody,
        // it's just hack for now, we override it inside the getQueueMessages with the queue name
        QueueUrl: '',
    })
    res.send({
        items: response
    })
})


export default route
