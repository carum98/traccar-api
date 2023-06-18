const router = require('./src/router')
const http = require('./src/http')
const PORT = 3000

const app = router()

app.get('/', (req, res) => {
    res.json({ message: 'Traccar API' })
})

app.get('/users/:id', (req, res) => {
    res.json({ id: req.params.id })
})

app.get('/position/:id', async (req, res) => {
    try {
        const data = await http('positions', {
            deviceId: req.params.id
        })
    
        res.json(data)
    } catch (error) {
        console.log(error)

        res.error(500, 'Internal server error')
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})