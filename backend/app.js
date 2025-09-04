import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import postRoutes from "./routes/post.routes.js"
import userRoutes from "./routes/user.routes.js"
import connectionRoutes from "./routes/connection.route.js"

dotenv.config()

const app = express()
const URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 9000;

app.use(cors())
app.use(express.json());
app.use(express.static("uploads"))
app.use(postRoutes)
app.use("/users",userRoutes)
app.use(connectionRoutes)

main()
  .then(() => {
    console.log("Connection succesful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URL);
}

app.listen(PORT,(req,res)=>{
    console.log(`server is running on port ${PORT} `);
})


