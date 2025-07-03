import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const Authorization = `Bearer ${process.env.OPENROUTER_API_KEY}`;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
export const openRouter = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    Authorization,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:3000',
  },
});
