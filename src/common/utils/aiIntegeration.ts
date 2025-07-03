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
