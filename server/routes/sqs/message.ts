import Route from 'express'
import sqsModule from './../../aws/modules/sqs'


const route = Route()


route.get('/', async (req, res) => {
    try {
        const { Region = 'us-east-1', QueueName, ...restParams } = req.query
        const response = await sqsModule.getQueueMessages({
            ...restParams,
            region: Region,
            queueName: QueueName,
            // it's just hack for now, we override it inside the getQueueMessages with the queue name
            QueueUrl: '',

        })
        res.send(response)
    } catch(e) {
        res.status(400).json(e.message)
    }
})

route.post('/', async (req, res) => {
    try {
        const response = await sqsModule.postQueueMessages({
            region: req.body.Region || 'us-east-1',
            queueName: req.body.QueueName,
            MessageBody: req.body.MessageBody,
            // it's just hack for now, we override it inside the getQueueMessages with the queue name
            QueueUrl: '',
        })
        res.send(response)
    } catch(e) {
        res.status(400).json(e.message)
    }
})

route.post('/ack', async (req, res) => {
    try {
        const response = await sqsModule.ackQueueMessages({
            region: req.body.Region || 'us-east-1',
            queueName: req.body.QueueName,
            messages: req.body.Messages,
        })
        res.send(response)
    } catch(e) {
        res.status(400).json(e.message)
    }
})


export default route
