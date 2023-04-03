import mongoose from "mongoose";

mongoose.connect("mongodb+srv://jojo:1234@nodejscursosalura.pstkkae.mongodb.net/Academic-Control");
const db = mongoose.connection;

export default db;