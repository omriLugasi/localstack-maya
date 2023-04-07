import Route from 'express'
import sqsModule from './../../aws/modules/sqs'
import sqsMessageRoute from './message'


const route = Route()


route.get('/', async (req, res) => {
    const response = await sqsModule.listQueues({
        region: req.query.region || 'us-east-1',
        prefix: req.query.prefix || ''
    })
    res.send({
        items: response.QueueUrls ?? []
    })
})

route.post('/', async (req, res) => {
    const { body } = req
    const response = await sqsModule.createQueue(body)
    res.send({
        response: response
    })
})


route.delete('/', async (req, res) => {
    try {
        const response = await sqsModule.deleteQueue({
            region: req.query.region || 'us-east-1',
            queueName: req.query.queueName
        })
        res.send(response)
    } catch(e) {
        res.status(400).json(e.message)
    }
})

route.use('/message', sqsMessageRoute)

export default route
