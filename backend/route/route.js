//use a router to ensure that people can't escape into our server 
const express = require("express");
const router = express.Router();

//misc 
const moment = require('moment');

//Mongoose models
const sensorReading = require("../models/sensorReading.js");
const sensorConfig = require("../models/sensorConfig.js");
const Alert = require("../models/alert.js");

//user is handled in app.js


//each of these directories uses the '/api' path
/*
    Users must log in before using these operations. We will only allow a user to 
    interact with readings FROM a sensor that has _id of their user account attached
    to it. First, get the user's sensors. Then, get the readings from those sensors. 
*/

//Get all readings from all sensors
router.get("/readings", function (req, res, next) {
    sensorReading.find(function (err, readings) {
        res.json(readings); //all readings
    });
});

//Get all readings from a single sensor
router.get("/readings/:sensor_ID", function (req, res, next) {
    sensorReading.find({
        sensor_ID: req.params.sensor_ID
    }, function (err, result) {
        if (err) {
            res.json({
                error: "Failed to get readings for sensor named"
            });
        } else {
            res.json(result);
        }
    });
});

router.get("/readingsToday", function (req, res, next) {
    let today = moment().startOf('day');
    sensorReading.find({
        //sensor_ID: req.params.sensor_ID,
        createdAt: { //everything recorded today
            $gte: today.toDate(), //greater than or equal to the beginning of the day
            $lte: moment(today).endOf('day').toDate() //less than or equal to the end of the day
        }
    }, function (err, result) {
        if (err) {
            res.json({
                error: "Failed to get readings for sensor named"
            });
        } else {
            res.json(result);
        }
    });
});

router.post("/readingsRange", function(req, res, next){ //this would be a get request but you can't add a body in a get request for the angular app
    let sensorIDs = req.body.sensors;
    let startDate = req.body.start;
    let endDate = req.body.end;
    startDate = moment(startDate).toDate();
    endDate = moment(endDate).endOf('day').toDate();
    sensorReading.find({
        sensor_ID: {$in: sensorIDs},
        createdAt:{
            $gte: startDate,
            $lte: endDate
        }
    }, function(err, docs){
        if(err){
            res.json({
                error: "Failed to get readings for sensors"
            });
        }else{
            res.json(docs);
        }
    })
    //res.status(200).send({status: 'OK'});
})

//Create a reading in a POST request, using the body of the request for attributes. 
router.post("/reading", function (req, res, next) {
    //first, check if the ID exists: if the ID used is associated with an existing sensor. 
    sensorConfig.find({
        sensor_ID: req.body.sensor_ID
    }, function (err, sensor) {
        if (err || sensor.length == 0) //error or no such sensor
        {
            res.json({
                msg: "Failed to add reading: sensor does not exist."
            });
        } else {
            let countAttributes = 0;
            let newReading = new sensorReading({ //using the schema to take everything in the request and make it an object to send to the database.
                sensor_name: req.body.sensor_name,
                sensor_ID: req.body.sensor_ID,
                carbon_dioxide: req.body.carbon_dioxide,
                carbon_monoxide: req.body.carbon_monoxide,
                humidity: req.body.humidity,
                particulate_matter: req.body.PM_03,
                temperature: req.body.temperature
            }); //if something that is required isn't in the request, it won't add it.

            //handle the case that, somehow, the sensor simply includes the ID and doesn't include any other measurement.
            for (let properties in newReading.toObject()) {
                countAttributes++;
            }
            if (countAttributes > 2) //if it's more than just the sensor ID and mongoDB object ID, then we'll save
            {
                //1) Save a new reading for a specific sensor
                newReading.save(function (err, reading) {
                    if (err) {
                        res.json({
                            error: "Failed to add reading: a required attribute may not have been filled in"
                        });
                    } else {
                        res.json({
                            msg: "Reading added"
                        });
                    }
                });

                //2 check if any of the exceeding conditions are met to create an alert. Use the sensor from the original '.find()'. 
                //check if each condition is null, if it's not, then make a check for the measurement type
                if(sensor[0].humidity_upper_condition){
                    if(newReading.humidity){
                        if(newReading.humidity >= sensor[0].humidity_upper_condition){
                            let newAlert = new Alert({
                                user_ID: sensor[0].user_ID,
                                user_email: sensor[0].user_email,
                                limit: sensor[0].humidity_upper_condition,
                                recordedAmount: newReading.humidity
                            });
                            newAlert.save(function(err, alert){
                                if(err){
                                    console.log('uh oh');
                                }
                            })
                        }
                    }
                }
                if(sensor[0].humidity_lower_condition){
                    if(newReading.humidity){
                        if(newReading.humidity <= sensor[0].humidity_lower_condition){
                            let newAlert = new Alert({
                                user_ID: sensor[0].user_ID,
                                user_email: sensor[0].user_email,
                                limit: sensor[0].humidity_lower_condition,
                                recordedAmount: newReading.humidity
                            });
                            newAlert.save(function(err, alert){
                                if(err){
                                    console.log('uh oh');
                                }
                            })
                        }
                    }
                }
                if(sensor[0].particulate_matter_upper_condition){
                    if(newReading.particulate_matter){
                        if(newReading.particulate_matter >= sensor[0].particulate_matter_upper_condition){
                            let newAlert = new Alert({
                                user_ID: sensor[0].user_ID,
                                user_email: sensor[0].user_email,
                                limit: sensor[0].particulate_matter_upper_condition,
                                recordedAmount: newReading.particulate_matter
                            });
                            newAlert.save(function(err, alert){
                                if(err){
                                    console.log('uh oh');
                                }
                            })
                        }
                    }
                }
                if(sensor[0].temperature_upper_condition){
                    if(newReading.temperature){
                        if(newReading.temperature >= sensor[0].temperature_upper_condition){
                            let newAlert = new Alert({
                                user_ID: sensor[0].user_ID,
                                user_email: sensor[0].user_email,
                                limit: sensor[0].temperature_upper_condition,
                                recordedAmount: newReading.temperature
                            });
                            newAlert.save(function(err, alert){
                                if(err){
                                    console.log('uh oh');
                                }
                            })
                        }
                    }
                }
                if(sensor[0].temperature_lower_condition){
                    if(newReading.temperature){
                        if(newReading.temperature <= sensor[0].temperature_lower_condition){
                            let newAlert = new Alert({
                                user_ID: sensor[0].user_ID,
                                user_email: sensor[0].user_email,
                                limit: sensor[0].temperature_lower_condition,
                                recordedAmount: newReading.temperature
                            });
                            newAlert.save(function(err, alert){
                                if(err){
                                    console.log('uh oh');
                                }
                            })
                        }
                    }
                }


            } else {
                res.json({
                    error: "Failed to add reading: A reading was not included in the request"
                });
            }
        }
    });
});

//Get all sensor configuration documents BELONGING to the authenticated user. 
router.get("/configs", function (req, res, next) {
    sensorConfig.find({
        user_ID: req.cookies['user_ID']
    }, function (err, configs) {
        res.json(configs); //all config objects
    });
});

//create and .save() a document into the "Sensor Configs" collection using the sensorConfig collection. 
router.post("/config", function (req, res, next) {
    let newConfig = new sensorConfig({ //using the schema to take everything in the request and make it an object to send to the database. 
        sensor_name: req.body.sensor_name,
        sensor_ID: req.body.sensor_ID,
        // carbon_dioxide_interval: req.body.carbon_dioxide_interval,
        // carbon_monoxide_interval: req.body.carbon_monoxide_interval,
        humidity_interval: req.body.humidity_interval,
        particulate_matter_interval: req.body.particulate_matter_interval,
        temperature_interval: req.body.temperature_interval,
        // carbon_dioxide_upper_condition: req.body.carbon_dioxide_upper_condition,
        // carbon_monoxide_upper_condition: req.body.carbon_monoxide_upper_condition,
        humidity_upper_condition: req.body.humidity_upper_condition,
        humidity_lower_condition: req.body.humidity_lower_condition,
        particulate_matter_upper_condition: req.body.particulate_matter_upper_condition,
        temperature_upper_condition: req.body.temperature_upper_condition,
        temperature_lower_condition: req.body.temperature_lower_condition,
        user_ID: req.body.user_ID,
        user_email: req.body.user_email
    });

    newConfig.save(function (err, reading) {
        if (err) {
            res.json({
                error: "Failed to add sensor"
            });
        } else {
            res.json({
                msg: "Sensor added"
            });
        }
    });
});

//Deletes a record by MongoDB object ID. '_id' attribute. 
//TODO: when deleting a sensor, delete its readings too!
router.delete("/config/:id", function (req, res, next) {
    sensorConfig.deleteOne({
        sensor_ID: req.params.id
    }, function (err, result) {
        if (err) {
            res.json({
                error: "Failed to delete config"
            });
        } else {
            res.json({
                msg: "Deleted config"
            });
        }
    });
});

/*
 We're changing anything about a specific sensor that is associated with a MongoDB id attibute, which is unique.
 Your link will look like: http://192.168.86.4:3000/api/config/61ba5ddd4bfe33d7d8593da0
 Your request body will include attributes that will change.
 This request changes everything for a specific document. A PATCH request should change only the different attributes.
 */
router.patch("/config/:id", function (req, res, next) { //use the object ID instead of the sensor ID, because we can manually configure the sensor ID.
    var isValid = true;
    if (req.body.sensor_ID == "") {
        isValid = false;
    }
    if (isValid) {
        sensorConfig.updateOne({
            sensor_ID: req.params.id
        }, req.body, function (err, result) { //replace anything in the object with what's in the request body.
            if (err || !result.acknowledged) //not acknowledged, which means that maybe a variable that doesn't exist is trying to be updated, or error.
            {
                res.json({
                    error: "Failed to update config" + err
                });
            } else {
                res.json({
                    msg: "Updated config"
                });
            }
        });
    } else {
        res.json({
            error: "Failed to update config: not a valid ID"
        });
    }
});

module.exports = router;