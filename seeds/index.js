// we will run this file when we want to manually fill our database with some fake data: 
const mongoose = require('mongoose');
//import the file with the array of cities
const cities = require('./cities')
// import el descriptiors wel places men el seedHelpers file
const {places,descriptors} = require('./seedHelpers')

const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});


//delwa2ty 3ayzin title based on the seedHelpers file
const sampleTitle = array => array[Math.floor(Math.random() * array.length)];

// empty the DB then fill it with this loop using our fake data from the cities.js and seedHelpers.js
const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        // random number for the price
        const price = Math.floor(Math.random() *20) +10;
        const camp = new Campground({
            // hardcodung my id from mongoose (just one of the users ya3ni to be assigned to all campgrounds for now)
            author: '69b0a79817b06704fd7d0398',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sampleTitle(descriptors)} ${sampleTitle(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
            price 
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});