import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { RequestMethods } from '@discordeno/rest';
import express from 'express';
import { REST } from './rest.js';

const REST_MANAGER_HOST = process.env.REST_MANAGER_HOST;
const REST_MANAGER_PORT = process.env.REST_MANAGER_PORT;
const SECRET_AUTHORIZATION = process.env.SECRET_AUTHORIZATION;

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.all('/*', async (req, res) => {
  console.log('Request received:');

  if (
    !SECRET_AUTHORIZATION ||
    SECRET_AUTHORIZATION !== req.headers.authorization
  ) {
    return res.status(401).json({ error: 'Invalid authorization key.' });
  }
  try {
    const result = await REST.makeRequest(
      req.method as RequestMethods,
      `${REST.baseUrl}${req.url}`,
      req.body
    );
    if (result) {
      console.log(result);
      res.status(200).json(result);
    } else {
      res.status(204).json();
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.listen(REST_MANAGER_PORT, () => {
  console.log(`Listening [REST]: ${REST_MANAGER_HOST}:${REST_MANAGER_PORT}`);
});
