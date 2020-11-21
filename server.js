const express = require('express')
const randomLocation = require('random-location')
const bodyParser = require('body-parser')
const turf = require('@turf/turf')


const app = express()
app.use(bodyParser.json())

app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);

        return res.status(400).json({ error: "Invalid JSON" })
    }

    next();
});

app.post('/generatePoint', (req, res) => {
    const ballLat = req.body.latitude;
    const ballLon = req.body.longitude;

    //Random point generation code :
    const ballPoint = {
        latitude: ballLat,
        longitude: ballLon
    }

    const R = 1000 // 1000meters=1Km

    const randomPoint = randomLocation.randomCircumferencePoint(ballPoint, R)
    res.send(randomPoint)
})

app.post('/calculateDistance', (req, res) => {
    const ballLat = req.body.latitude;
    const ballLon = req.body.longitude;
    const goalLat = req.body.goalLatitude;
    const goalLon = req.body.goalLongitude;

    

    var from = turf.point([ballLat, ballLon]);
    var to = turf.point([goalLat, goalLon]);

    var distance = turf.distance(from, to);

    //console.log(distance)
    res.send({ "Distance in KM": distance })



})

//handling incorrect routes
app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: 'Page Not found'
    })
})

app.listen(process.env.PORT || 3000)
