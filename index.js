
require('dotenv').config()
const home = "10001"

// ffpass configuration
const fordApi = require('ffpass')
const car = new fordApi.vehicle(process.env.FORD_USERNAME, process.env.FORD_PASSWORD, process.env.VIN)

// telegram bot stuff
const telegram = require('telegram-bot-api')
const user = process.env.TELEGRAM_USER
var api = new telegram({
    token: process.env.TELEGRAM_TOKEN
})

// geocoder setup
const NGo = require('node-geocoder')
const geoapikey = process.env.MAPS_API_KEY
var geocoder = NGo({
    provider: 'geocodio',
    httpAdapter: 'https',
    apiKey: geoapikey,
})

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function sendMessage(text) {
    return new Promise(async (resolve, reject) => {
        try {
            var result = await api.sendMessage({
                chat_id: user,
                text: text
            })
            resolve(result)
        } catch (error) {
            reject(`Got an error from Telegram API: ${error}`)
        }
    })
}

async function main() {
    // initialize a variable for saving the vehicle location
    var savedLocation = home
    // variable to track vehicle location changes
    var locationChanged = false
    // loop to check vehicle location
    while (true) {
        try {
            await car.auth()
            var vehicleData = await car.status()
            location = `${vehicleData.gps.latitude}, ${vehicleData.gps.longitude}`
            console.log("Current Vehicle Location: " +location)
            // check to see if the vehicle location has changed by comparing the saved location to the current location
            if (location == savedLocation) {
                locationChanged = false
            } else {
                locationChanged = true
            }
            // if the vehicle location has changed see if it is within the geofence
            if (locationChanged) {
                console.log(`Vehicle location has changed checking to see if the vehicle has left the geofence.`)
                // we are only going to do a location lookup if the vehicle has moved
                location = await geocoder.reverse({lat:vehicleData.gps.latitude, lon:vehicleData.gps.longitude})
                location = location[0].zipcode
                if (location == home) {
                    console.log(`The vehicle is within the geofence.`)
                } else {
                    console.log(`The vehicle has left the geofence.`)
                    await sendMessage(`Your vehicle has left the geofence!`)
                }
                // we have processed a location change set the locationChanged variable back to false for the next iteration and save the location
                savedLocation = `${vehicleData.gps.latitude}, ${vehicleData.gps.longitude}`
                locationChanged = false
            } else {
                console.log(`The vehicle location has not changed.`)
            }
            await sleep(60000)
        } catch (error) {
            await sendMessage(`Vehicle tracker encountered an error: ${error}`)
            console.log(error)
        }
    }
}
main()