import dotenv from 'dotenv';

dotenv.config({
  path: '../.env'
});

export default {
  app: {
    port: +(process.env.PORT || 3000)
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  }
}