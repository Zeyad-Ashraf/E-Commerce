import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
export const openRouter = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    Authorization: `Bearer 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`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:3000',
  },
});
