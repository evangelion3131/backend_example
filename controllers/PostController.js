import postModel from '../models/PostModel.js'

export const create = async (req, res) => {
    try {
        console.log(req);
        const doc = new postModel({
            datetime: req.body.datetime,
            action: req.body.action,
            user: req.userId,
            sentOneHourReminder: false,
            sentFifteenMinutesReminder: false,
    });
    const post = await doc.save();
    res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать новую задачу'
        });}
};

export const getAll = async (req, res) => {
    try {
        const posts = await postModel
        .find({ user: req.userId })
        .populate('name')
        .exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти посты',
        });
    };
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await postModel.findOne({ _id: postId, user: req.userId }).exec();

        if (!post) {
            return res.status(403).json({ message: 'Доступ запрещен или запись не найдена' });
        }

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти запись',
        });
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await postModel.findOneAndDelete({ _id: postId, user: req.userId }).exec();

        if (!post) {
            return res.status(403).json({ message: 'Доступ запрещен или запись не найдена' });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить запись',
        });
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        // Обновить только запись текущего пользователя
        const post = await postModel.findOneAndUpdate(
            { _id: postId, user: req.userId },
            { datetime: req.body.datetime, action: req.body.action, sentOneHourReminder: false, sentFifteenMinutesReminder: false, },
            { new: true }
        ).exec();

        if (!post) {
            return res.status(403).json({ message: 'Доступ запрещен или запись не найдена' });
        }

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить запись',
        });
    }
};

