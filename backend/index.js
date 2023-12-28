import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const app = express()

// Middleware for parsing body
app.use(express.json())

// Enable CORS
app.use(cors())


const PORT = process.env.PORT || 8080

app.get( "/",(req, res)=>{
    return res.status(234).send('Server is running!');
})

// Connect to MongoDB database
mongoose.connect(process.env.MongodbURL)
.then(()=>{
    console.log("Connected to DB")
    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
})
.catch((error)=>{
    console.log(error)
});