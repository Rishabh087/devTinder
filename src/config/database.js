const mongoose =  require("mongoose") ;


const connectDb =  async () => {
//await mongoose.connect("mongodb+srv://me_rishabh:zK8aTIkd4475TgMz@namaste-nodejs.ijvlbwa.mongodb.net/devTinder")
await mongoose.connect(process.env.MONGO_URI);

}

module.exports = connectDb ;