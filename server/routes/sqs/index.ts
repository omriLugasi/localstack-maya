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
        items: response ?? []
    })
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

export default route
