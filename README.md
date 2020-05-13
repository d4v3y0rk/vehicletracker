# FFPass Vehicle Tracker

This small NodeJS application uses [ffpass](https://www.npmjs.com/package/ffpass) to track your vehicle location and alerts you when it leaves a predefined area.

## Setup

You will need to setup a few things in order to use this:

1. A telegram account
2. A telegram bot account
3. A Geocodio account
4. Your vehicle nust already be registered with FordPass

## Usage

Create a `.env` file containing the following content:

```
VIN="<your vehicle VIN number>"
FORD_USERNAME="<your fordpass username>"
FORD_PASSWORD="<your fordpass password>"
MAPS_API_KEY="<your geocodio api key>"
TELEGRAM_TOKEN="<telegram bot token>"
TELEGRAM_USER="<your telegram user id number>"
```

Once that is created, in the code set the predefined area by changing the home zip code. 

The home variable can be more complex but I just used zip code for demonstration purposes. 

Then run the application:

`node index.js`

## Docker Usage

You can have this run all the time on your computer using docker.

After your have done the setup steps and created a .env file...

`docker build --tag="vehicletracker" .`

`docker run -d vehicletracker`