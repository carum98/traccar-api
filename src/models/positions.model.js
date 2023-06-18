module.exports = (data) => ({
    id: data.id,
    latitude: data.latitude,
    longitude: data.longitude,
    speed: data.speed,
    altitude: data.altitude,
    createdAt: data.fixTime
})