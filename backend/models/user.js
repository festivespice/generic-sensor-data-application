const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate'); //has to be added as a plugin


//This is where the schema is outlined for a specific collection 'user'

const userSchema = mongoose.Schema({ //the schema is augmented by our passport strategy.
    googleId: { //will be used if I ever implement the google authentication for our app. 
        type: String
    }
    },
    {
        timestamps: {createdAt: true, updatedAt: true}
    }
);

userSchema.plugin(passportLocalMongoose); //Lets us do 'User.register'
userSchema.plugin(findOrCreate);

const user = module.exports = mongoose.model("users", userSchema);