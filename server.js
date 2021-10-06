// ======================= //
// IMPORT OUR DEPENDENCIES //
// ======================= //

require("dotenv").config() // load ENV variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
const methodOverride = require("method-override")
const mongoose = require("mongoose")


// =================== //
// DATABASE CONNECTION //
// =================== //

// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))


// ================ //
//    OUR MODELS    //
// ================ //

// pull schema and model from mongoose
const {Schema, model} = mongoose

// make animals schema
const animalSchema = new Schema({
    species: String,
    extinct: Boolean,
    location: String,
    lifeExpectancy: Number
})

// make animal model
const Animal = model("Animal", animalSchema)


// ===================================== //
// CREATE OUR EXPRESS APPLICATION OBJECT //
// ===================================== //

const app = express()

// ================ //
//    MIDDLEWARE    //
// ================ //
app.use(morgan("tiny")) // logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically


// =================== //
//        ROUTES       //
// =================== //

// INITAL ROUTE
app.get("/", (req, res) => {
    res.send("your server is running...better catch it.")
})


// =============== //
// SERVER LISTENER //
// =============== //
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))