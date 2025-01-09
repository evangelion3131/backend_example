import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from '../models/UserModel.js'
import { validationResult } from "express-validator";
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        telegramId: req.body.telegramId,
        passwordHash: hash,
        username: req.body.username,
        chatId: req.body.chatId
    });

    const user = await doc.save();

    const token = jwt.sign(
        {
            _id: user._id,
        }, 
        process.env.JWT,
        {
            expiresIn: '30d'
        });

    const { passwordHash, ...userData } = user._doc;

    res.json({
        ...userData,
        token,
    });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка регистрации'
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ telegramId: req.body.telegramId });
        if (!user) {
            return res.status(404).json({
                message:'Неверные логин/пароль'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(404).json({
                message:'Неверные логин/пароль'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            process.env.JWT,
            {
                expiresIn: '30d'
            });
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(403).json({
                message: 'Упс, кажется, у вас нет доступа'
            });
        };
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData
        });
    }   catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};

