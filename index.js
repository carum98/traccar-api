const router = require('./src/core/router')
const Positions = require('./src/controllers/positions')
const Authentication = require('./src/middleware/authentication')

const PORT = 3000

const app = router()

app.use(Authentication)

app.get('/', (req, res) => {
    res.json({ message: 'Traccar API' })
})

app.get('/position/:id', Positions.get)
app.get('/position/:id/html', Positions.html)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})