import express from 'express'
import config from 'config'
import "reflect-metadata"
import connectToDatabase from './db/connectToDatabase';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import { protectedRoute } from './middlewares/protectedRoute.middleware';

const app = express();
const PORT = config.get('database.port') || 3001;

// middlewares

app.use(express.json());
app.use(helmet())
app.use(cookieParser())


// routes
app.use('/api/v1', register)
app.use('/api/v1', protectedRoute)

connectToDatabase(app, Number(PORT))