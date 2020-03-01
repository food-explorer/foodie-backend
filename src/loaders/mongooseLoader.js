import mongoose from 'mongoose';
import config from '../config';

const connectDB = () => mongoose.connect(config.DATABASE_URL, { useNewUrlParser: true });

export default connectDB;
