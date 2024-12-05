const express = require('express');
const connectDB = require('./db');  
const app = express();
const mongoose = require('mongoose');
const Blog = require('./Models/Blog');

app.use(express.json());  


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

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
