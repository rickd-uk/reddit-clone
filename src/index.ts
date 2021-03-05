import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';
import subRoutes from './routes/subs';

import trim from './middleware/trim';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());
app.get('/', (_, res) => {
  res.send('Hello world');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subs', subRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at localhost on port ${PORT}`);

  try {
    await createConnection();
    console.log('Database connected');
  } catch (err) {
    console.error(err);
  }
});

// createConnection()
//   .then(async´ (connection) => {
//     console.log('Inserting a new user into the database...');
//     const user = new User();
//     user.firstName = 'Timber';
//     user.lastName = 'Saw';
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log('Saved a new user with id: ' + user.id);

//     console.log('Loading users from the database...');
//     const users = await connection.manager.find(User);
//     console.log('Loaded users: ', users);

//     console.log('Here you can setup and run express/koa/any other framework.');
//   })
//   .catch((error) => console.log(error));
