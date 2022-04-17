/*
 The schema for the sensor data, which will be sent
 in JSON from the sensors to this API by
 doing a POST request to a specified URL for our
 server IP!
 */
const mongoose = require("mongoose"); //how we interact with MongoDB using node and express.

//The Schema that one of our database collections (table) will use for its documents (rows). 
const sensorConfigSchema = mongoose.Schema({
    sensor_name: {
        type: String,
        required: false
    },
    sensor_ID: {
        type: String,
        required: true,
        unique: true
    }, //may need to add an IP to this list. Expect that it will change.
    // carbon_dioxide_interval: { //how many minutes until we should expect another POST request? Default is 5
    //     type: Number,
    //     required: false,
    //     default: 5
    // },
    // carbon_monoxide_interval: {
    //     type: Number,
    //     required: false,
    //     default: 5
    // },
    humidity_interval: {
        type: Number,
        required: false,
        default: 5
    },
    particulate_matter_interval: {
        type: Number,
        required: false,
        default: 5
    },
    temperature_interval: {
        type: Number,
        required: false,
        default: 5
    },
    //maybe we can show upper-lower boundaries for a sensor as we try to graph?
    // carbon_dioxide_upper_condition: { //at what point is there too much carbon dioxide in the air?
    //     type: Number
    // },
    // carbon_monoxide_upper_condition: { //at what point is there too much carbon monoxide in the air?
    //     type: Number
    // },
    humidity_upper_condition: { //at what point is there too much humidity in the air?
        type: Number
    },
    humidity_lower_condition: { //at what point is there too little humidity in the air?
        type: Number
    },
    particulate_matter_upper_condition: { //at what point is the PM level too high?
        type: Number
    },
    temperature_upper_condition: { //At what farenheit will we send an alert if it's too hot?
        type: Number
    },
    temperature_lower_condition: { //At what farenheit will we send alert if it's too cold?
        type: Number
    },
    user_ID: {
        type: String,
    },
    user_email: {
        type: String
    }
});

/*
 export the schema. Uses collection "Sensor Configs" or creates it if it doesn't already exist.
 This takes effect when this JS file is required in another file, like ../route/route.js
 */
const sensorConfig = module.exports = mongoose.model("configs", sensorConfigSchema);