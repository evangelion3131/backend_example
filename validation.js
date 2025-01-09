import { body } from 'express-validator'

export const authValidation = [
    body('telegramId').isLength({ min: 5 }),
    body('password').isLength({ min: 8 }),
    body('username').isLength({ min: 3 })
];

export const loginValidation = [
    body('telegramId').isLength({ min: 5 }),
    body('password').isLength({ min: 8 }),
];

export const createActionValidation = [
    body('datetime').isDate(),
    body('action').isLength({ min: 1, max: 30 })
];