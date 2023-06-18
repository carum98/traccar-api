module.exports = (req, res, next) => {
    if (req.headers['x-api-key'] === process.env.API_KEY) {
        next()
    } else {
        res.status(401).json({ message: 'Invalid API Key' })
    }
}