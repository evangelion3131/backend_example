//server.js

import express from "express";
import mongoose from "mongoose";
import checkAuth from './utils/checkAuth.js'
import * as Validation from './validation.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose
    .connect(MONGODB_URL)
    .then(() => console.log('Database OK'))
    .catch((err) => console.log(err));


const app = express();

app.use(express.json());
app.use(cors());

//route
app.post('/auth/register', Validation.authValidation, UserController.register);
app.post('/auth/login', Validation.loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/posts', checkAuth, PostController.getAll);
app.get('/posts/:id', checkAuth, PostController.getOne);
app.post('/create_post', checkAuth, Validation.createActionValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

// LISTEN
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    };

    console.log('Server OK');
});