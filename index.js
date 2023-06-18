const router = require('./src/core/router')
const Positions = require('./src/controllers/positions.controller')
const PORT = 3000

const app = router()

app.get('/', (req, res) => {
    res.json({ message: 'Traccar API' })
})

app.get('/position/:id', Positions.get)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})