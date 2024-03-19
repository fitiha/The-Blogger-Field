import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import blogModel from '../models/blogModel.js';

export const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists with this email.");
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            blog: [],
        });

        // Save the new user
        const result = await newUser.save();
        const token = jwt.sign({ userId: result._id, email: result.email }, process.env.JWT_SECRET, { expiresIn: '300s' }); //the first object can be any thing. token expires in 5min
        res.status(201).json({ userId: result._id, userName: result.name, token: token, userEmail: result.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req, res, next) => {
    // if (!req.user) { //used for extra authorization - req.user = decoded;
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }
    try {
        const users = await userModel.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const signIn = (req, res, next) => {
    const { email, password } = req.body;
    userModel.findOne({ email })
        .then((user) => {
            if (!user) {
                res.status(404).json({ error: "Can't find a user with this email" });
            } else {
                let doPasswordsMatch = bcrypt.compareSync(password, user.password);
                if (!doPasswordsMatch)
                    res.status(422).json("Passwords do not match");
                else {
                    // res.status(200).json("welcome " + user.name);
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '300s' }); //the first object can be any thing. token expires in 5min
                    res.status(200).json({ token: token, userId: user._id, userName: user.name, userEmail: user.email });// we then store the token in the frontend state and use it to access the rest of the pages that require auth as a middleware 
                }
            }
        })
        .catch((err) => {
            res.send(err);
        })
}

export const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    await userModel.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "No user found" });
            } else {
                res.status(200).json({ user });
            }
        })
        .catch(err => { console.log(err) })
}

export const updateUser = async (req, res, next) => {
    const userId = req.params.id;
    // console.log(userId, req.body)
    await userModel.findByIdAndUpdate(userId, req.body, { new: true })
        .then((updated) => {
            if (!updated) {
                return res.status(404).json({ message: "No user found" });
            } else {
                res.status(200).json({ updated });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: err?.message });
        })
}

export const deleteUser = async (req, res, next) => {
    if (!req.user) { //used for extra authorization - req.user = decoded;
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.params.id;
    userModel.findByIdAndDelete(userId)
        .then((user) => {
            res.status(200).json({ message: 'User deleted successfully' })
        })
        .catch((err) => {
            res.status(500).json({ message: err?.message });
        })
}

export const addBlog = async (req, res, next) => {
    const { title, content, userId, author } = req.body;

    const blog = new blogModel({
        title,
        content,
        user: userId,
        author: author
    });

    try {
        await blogModel.create(blog)
            .then((response) => {
                console.log("add blogger: ", response)
            })
            .catch((err) => console.log(err))

        userModel.findByIdAndUpdate(user._id, { $push: { blogs: newBlog._id } }, { new: true }).exec();
        res.status(201).json({ blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}