import { env } from '../env'
import * as mongoose from 'mongoose'

const connectToDatabase = (mongoDatabaseURI = env.MONGO_URI) =>
  mongoose.connect(env.MONGO_URI)

export default connectToDatabase
