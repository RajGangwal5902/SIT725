const express = require('express');
const connectDB = require('./db');
const app = express();
const mongoose = require('mongoose');
const Blog = require('./Models/Blog');
const fs = require('fs');
const path = require('path');


const http = require('http').Server(app);
let socketIo = require('socket.io')(http);


app.use(express.json());


app.use(express.static(path.join(__dirname)));


connectDB();


app.post('/blogs', async (req, res) => {
    try {
        const newBlog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            tags: req.body.tags
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post deleted successfully', blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            tags: req.body.tags
        }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


socketIo.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 100));
    }, 1000);
});


const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

