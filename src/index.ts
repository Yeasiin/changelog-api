import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {router as appRoutes} from "./server"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(appRoutes)


const PORT = process.env.PORT || 3001
app.listen(PORT,()=> console.log(`Your App is running on http://localhost:${PORT}`))


