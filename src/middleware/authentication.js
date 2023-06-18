module.exports = (req, res, next) => {
    if (req.headers['x-api-key'] === '123456') {
        next()
    } else {
        res.status(401).json({ message: 'Invalid API Key' })
    }
}