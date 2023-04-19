import Route from 'express'
import s3Module from './../../aws/modules/S3'

const route = Route()


route.get('/', async (req, res) => {
    try {
        const response = await s3Module.listObjectsV2(req.query)
        res.send(response)
    } catch(e) {
        console.error(e)
        res.status(400).json(e.message)
    }
})


export default route
