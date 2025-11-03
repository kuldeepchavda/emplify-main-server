const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGODB_URL


const databaseConnect  = ()=>{
    mongoose.connect(MONGO_URI)
    .then((res) => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log("Error connecting to the database...")
    })


mongoose.connection.on("error", (err) => {
    console.log("Error occured",err.message);
})

}
function getCollection(COLLECTION) {

    if (mongoose.models[COLLECTION]) {
        return mongoose.model(COLLECTION);
    }

    return mongoose.model(
        COLLECTION,
        new mongoose.Schema({}, { strict: false }),
        COLLECTION
    );
}

module.exports = {databaseConnect,getCollection}
