const router = require('./src/router')
const PORT = 3000

const app = router()

app.get('/', (req, res) => {
    res.json({ message: 'Traccar API' })
})

app.get('/users/:id', (req, res) => {
    res.json({ id: req.params.id })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})