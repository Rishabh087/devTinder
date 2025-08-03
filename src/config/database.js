const mongoose =  require("mongoose") ;


const connectDb =  async () => {
await mongoose.connect("mongodb+srv://me_rishabh:zK8aTIkd4475TgMz@namaste-nodejs.ijvlbwa.mongodb.net/devTinder")
}

module.exports = connectDb ;