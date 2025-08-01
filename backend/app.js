import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import postRoutes from "./routes/post.routes.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config()

const app = express()
const URL = process.env.MONGO_URL;

app.use(cors())
app.use(express.json());
app.use(express.static("uploads"))
app.use(postRoutes)
app.use(userRoutes)

main()
  .then(() => {
    console.log("Connection succesful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URL);
}

app.listen(9000,(req,res)=>{
    console.log("server is running on port 9000");
})


