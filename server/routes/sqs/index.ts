import Route from 'express'
import sqsModule from './../../aws/modules/sqs'
import sqsMessageRoute from './message'


const route = Route()


route.get('/', async (req, res) => {
    try {
        const queuesList = await sqsModule.listQueues({
            region: req.query.Region || 'us-east-1',
            prefix: req.query.Prefix || ''
        })
        const queues = []
        if (Array.isArray(queuesList)) {
            for (const queueName of queuesList) {
                const response = await sqsModule.getQueueDetailsByName({
                    region: req.query.Region || 'us-east-1',
                    queueName
                })
                queues.push({
                    QueueName: queueName,
                    Attributes: response.Attributes
                })
            }
        }
        res.send({
            Items: queues
        })
    } catch(e) {
        console.error(e)
        res.send({
            items: []
        })
    }
})

route.post('/', async (req, res) => {
   try {
       const { body } = req
       const response = await sqsModule.createQueue({
           queueName: body.QueueName,
           attributes: body.Attributes,
           tags: body.Tags,
           region: body.Region || 'us-east-1'
       })
       res.send({
           Response: response
       })
   } catch (e) {
       console.error(e)
       res.status(400).json(e)
   }
})

route.post('/purge', async (req, res) => {
    try {
        const response = await sqsModule.purgeQueue({
            region: req.body.Region || 'us-east-1',
            queueName: req.body.QueueName
        })
        res.send(response)
    } catch(e) {
        res.status(400).json(e.message)
    }
})

route.delete('/', async (req, res) => {
    try {
        const response = await sqsModule.deleteQueue({
            region: req.query.Region || 'us-east-1',
            queueName: req.query.QueueName
        })
        res.send(response)
    } catch(e) {
        res.status(400).json(e.message)
    }
})

route.use('/messages', sqsMessageRoute)

route.get('/attributes/:QueueName', async (req, res) => {
    try {
        const response = await sqsModule.getQueueDetailsByName({
            region: req.query.Region || 'us-east-1',
            queueName: req.params.QueueName
        })
        res.send(response)
    } catch(e) {
        console.error(e)
        res.sendStatus(400)
    }
})

export default route
