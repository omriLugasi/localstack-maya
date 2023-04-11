import Route from 'express'
import sqsModule from './../../aws/modules/sqs'
import sqsMessageRoute from './message'


const route = Route()


route.get('/', async (req, res) => {
    try {
        const queuesList = await sqsModule.listQueues({
            region: req.query.region || 'us-east-1',
            prefix: req.query.prefix || ''
        })
        const queues = []
        if (Array.isArray(queuesList)) {
            for (const queueName of queuesList) {
                const response = await sqsModule.getQueueDetailsByName({
                    region: req.query.region || 'us-east-1',
                    queueName
                })
                queues.push({
                    queueName,
                    attributes: response.Attributes
                })
            }
        }
        res.send({
            items: queues
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
           ...body,
           region: body.region || 'us-east-1'
       })
       res.send({
           response: response
       })
   } catch (e) {
       console.error(e)
       res.status(400).json(e)
   }
})

route.post('/purge', async (req, res) => {
    try {
        const response = await sqsModule.purgeQueue({
            region: req.body.region || 'us-east-1',
            queueName: req.body.queueName
        })
        res.send(response)
    } catch(e) {
        res.status(400).json(e.message)
    }
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

route.use('/messages', sqsMessageRoute)

route.get('/attributes/:queueName', async (req, res) => {
    try {
        const response = await sqsModule.getQueueDetailsByName({
            region: req.query.region || 'us-east-1',
            queueName: req.params.queueName
        })
        res.send(response)
    } catch(e) {
        console.error(e)
        res.sendStatus(400)
    }
})

export default route
