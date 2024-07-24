//Mongoose is an Object Data Modeling library
//For MongoDB and Node.js
import mongoose from "mongoose";

//for all the collections I make on the mongodb server, I will make a new mongodb
//schema here so our app knows what's up and how to interact with it.

// {"_id":{"$oid":"6695f2fc678618dd9b4c14cf"},
// "username":"mateusmatters",
// "hashed_password":"ssbkirby75",
// "first_name":"Mateus",
// "last_name":"Kelly",
// "email":"chaoticscooter823@gmail.com",
// "birthday":{"$date":{"$numberLong":"946702800000"}},
// "sex":"M",
// "location":"12345 Imaginary Lane"}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashed_password: { type: String, required: true },
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  email: { type: String, required: true },
  birthday: { type: String, required: false },
  sex: { type: String, required: false },
  location: { type: String, required: false },
  createdOn: { type: Date, default: Date.now },
});

//A model is going to be what our table/collection is going to be like
//The first parameter is going to be the name of our collection (example users)
//The second parameter will be what expected documents/rows we are expecting (example user)
//if the collection does not exist, our very first connection to the database will make the collection exist
//if it already exists, then we will be able to perform the queries/operations we want to on it
const Users = mongoose.model("users", UserSchema);

export default Users;
