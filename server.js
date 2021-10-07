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

// SEED ROUTE
app.get("/animals/seed", (req, res) => {

    // array of starter animals
    const startAnimals = [
        {species: "Lion", extinct: false, location: "Africa", lifeExpectancy: 12},
        {species: "Tiger", extinct: false, location: "South-East Asia", lifeExpectancy: 10},
        {species: "Lynx", extinct: false, location: "North America & Europe", lifeExpectancy: 15},
        {species: "Snow Leopard", extinct: false, location: "Central & South Asia", lifeExpectancy: 12},
        {species: "Cheetah", extinct: false, location: "Africa", lifeExpectancy: 12}
    ]

    // Delete all animals
    Animal.remove({}, (err, data) => {
        // Seed Starter Animals
        Animal.create(startAnimals, (err, data) => {
            // send created animals as response to confirm creation
            res.json(data)
        })
    })
})

// THE INDEX ROUTE (GET => /animals)
app.get("/animals", (req, res) => {
    Animal.find({}, (err, animals) => {
        res.render("animals/index.ejs", { animals })
    })
})

// THE NEW ROUTE (GET => /animals/new)
app.get("/animals/new", (req, res) => {
    res.render("animals/new.ejs")
})

// THE CREATE ROUTE (POST => /animals)
app.post("/animals", (req, res) => {
    // check if the extinct property should be true or false
    req.body.extinct = req.body.extinct === "on" ? true : false
    // create the new animal
    Animal.create(req.body, (err, animal) => {
        // redirect the user back to the main animals page after animal is created
        res.redirect("/animals")
    })
})

// THE SHOW ROUTE (GET => /animals/:id)
app.get("/animals/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    
    // find the particular animal from the database
    Animal.findById(id, (err, animal) => {
        res.render("animals/show.ejs", {animal})
    })
})


// =============== //
// SERVER LISTENER //
// =============== //
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))