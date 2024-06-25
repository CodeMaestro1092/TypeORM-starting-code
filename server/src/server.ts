import express from 'express'
import config from 'config'
import "reflect-metadata"
import connectToDatabase from './db/connectToDatabase';

const app = express();
const PORT = config.get('database.port') || 3001;

// middlewares

app.use(express.json());


// routes
// app.use('/api/v1', )

connectToDatabase(app, Number(PORT))