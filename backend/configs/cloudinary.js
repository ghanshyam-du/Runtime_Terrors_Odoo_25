import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Loads CLOUDINARY_URL

// No need for manual cloudinary.config() if using the full URL
// It will automatically use process.env.CLOUDINARY_URL

export default cloudinary;
