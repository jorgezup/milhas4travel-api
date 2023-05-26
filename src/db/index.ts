import { env } from '../env'
import * as mongoose from 'mongoose'

const mongoUri = `mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`

const connectToDatabase = (mongoDatabaseURI = mongoUri) =>
  mongoose.connect(mongoUri)

export default connectToDatabase
