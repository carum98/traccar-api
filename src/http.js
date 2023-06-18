module.exports = async function http(path, params) {
    const url = new URL(`${process.env.API_ENDPOINT}/${path}`)

    // Add query params
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(process.env.API_EMAIL + ':' + process.env.API_PASSWORD)
        }
    })

    return await response.json()
}