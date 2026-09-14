import  dotenv  from "dotenv";

//to access the .env vairables
dotenv.config();
if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not available in .env file")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not available in .env file")
}
const config={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET
}

export default config;