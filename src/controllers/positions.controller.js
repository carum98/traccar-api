const httpClient = require('../core/http-client')
const Positions = require('../models/positions.model')

module.exports = {
    async get(req, res) {
        try {
            const today = new Date().toISOString().split('T')[0]

            const data = await httpClient('/positions', {
                deviceId: req.params.id,
                from: `${today}T00:00:00Z`,
                to: `${today}T23:59:59Z`,
            })
        
            res.json(data.map(position => Positions(position)))
        } catch (error) {
            console.log(error)
    
            res.error(500, 'Internal server error')
        }
    }
}