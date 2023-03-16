import * as dotenv from 'dotenv'
import { RequestMethods } from '@discordeno/rest'
import express from 'express'
import { REST } from './rest.js'

dotenv.config()

const AUTHORIZATION = process.env.REST_AUTHORIZATION as string
const REST_PORT = process.env.REST_PORT as string
const REST_HOST = process.env.REST_HOST as string

const app = express()

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

app.all('/*', async (req, res) => {
    console.log('Request received')
    if (!AUTHORIZATION || AUTHORIZATION !== req.headers.authorization) {
        return res.status(401).json({ error: 'Invalid authorization key.' })
    }

    try {
        const result = await REST.makeRequest(req.method as RequestMethods, `${REST.baseUrl}${req.url}`, req.body)

        if (result) {
            console.log(result)
            res.status(200).json(result)
        } else {
            res.status(204).json()
        }
    } catch (error: any) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.listen(REST_PORT, () => {
    console.log(`REST listening at ${REST_HOST}:${REST_PORT}`)
})