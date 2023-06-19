const httpClient = require('../core/http-client')
const Positions = require('../models/positions')

async function request(id) {
    const today = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'America/Costa_Rica' })
    ).toISOString().split('T')[0]

    const data = await httpClient('/positions', {
        deviceId: id,
        from: `${today}T00:00:00Z`,
        to: `${today}T23:59:59Z`,
    })

    return data.map(position => Positions(position))
}

module.exports = {
    async get(req, res) {
        try {
            const data = await request(req.params.id)
        
            res.json(data)
        } catch (error) {
            console.log(error)
    
            res.error(500, 'Internal server error')
        }
    },
    async html(req, res) {
        try {
            const data = await request(req.params.id)

            const coords = data.map(position => [position.latitude, position.longitude])

            res.html(`<!DOCTYPE html><html><head><title>Mapa con recorrido</title><meta charset="utf-8"/><link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/><style>#map{height: 100vh;}</style></head><body>
                <div id="map"></div><script src="https://unpkg.com/leaflet/dist/leaflet.js"></script> 
                <script>const puntosRecorrido=${JSON.stringify(coords)}; const map=L.map('map').setView([9.9510016, -84.12055], 15); 
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 }).addTo(map);
                    L.polyline(puntosRecorrido,{color: 'red', weight: 5}).addTo(map); 
                </script> </body> </html>`)
        } catch (error) {
            console.log(error)
    
            res.error(500, 'Internal server error')
        }
    }
}