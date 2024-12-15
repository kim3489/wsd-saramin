import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from'../models/user.js';

const generateToken = (user) => {
    return jwt.sign({ id: user, }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(Buffer.from(password).toString('base64'), 10);
        const user = new User({ email, password: hashedPassword, name });
        await user.save();

        res.status(201).json({ status: 'success', message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(Buffer.from(password).toString('base64'), user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.json({ status: 'success', data: { token } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.json({ status: 'success', message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        res.json({
            status: 'success',
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }
        
        await user.deleteOne();

        res.json({
            status: 'success',
            message: 'User account deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(403).json({ status: 'error', message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
        }

        const newToken = generateToken(decoded.id);


        res.json({ status: 'success', data: { token:newToken } });
    } catch (err) {
        res.status(403).json({ status: 'error', message: 'Invalid or expired refresh token' });
    }
};
