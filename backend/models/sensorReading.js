/*
 The schema for the sensor data, which will be sent
 in JSON from the sensors to this API by
 doing a POST request to a specified URL for our
 server IP!
 */

const mongoose = require("mongoose");

const sensorReadingSchema = mongoose.Schema({
    sensor_name: {
        type: String,
        required: false
    },
    sensor_ID: {
        type: String,
        required: true
    },
    carbon_dioxide: {
        type: Number,
        required: false
    },
    carbon_monoxide: {
        type: Number,
        required: false
    },
    humidity: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v*100)/100, //two decimal places
        required: false
    },
    particulate_matter: {
        type: Number,
        required: false
    },
    temperature: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v*100)/100, //two decimal places
        required: false
    }
}, {
    timestamps: {createdAt: true, updatedAt: false} //used to get a 'created at' and 'updated at' attributes.
});

//the "model()" function exports the schema as a collection to the used database. 
const sensorReading = module.exports = mongoose.model("readings", sensorReadingSchema);