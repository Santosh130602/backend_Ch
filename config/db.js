const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(() => console.log(`MongoDB connected successfully`.yellow.underline.bold))
    .catch( (error) => {
        console.error(`Error: ${error.message}`.red.bold)
        console.error(error);
        process.exit(1);
    } )
};



