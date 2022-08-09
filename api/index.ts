import cookieParser from "cookie-parser";
import cors from 'cors'
import express from 'express'
import router from "./router";
import {databaseClient} from "./model/database";

import * as dotenv from 'dotenv'


const app = express()

app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))
app.use(cookieParser())

app.use('/', router)


const start = async () => {
    await databaseClient.connect()
    app.listen(3000, () => {
        console.log('server has started! ')
    })
}


start()
