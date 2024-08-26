
import express from 'express';
import cors from 'cors';
import routes from './routes';
import config from './config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', routes)
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.listen(config.app.port, () => {
  console.log(`Server is running on port ${config.app.port}`);
});
