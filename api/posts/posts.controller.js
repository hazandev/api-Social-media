const postsService = require('./posts.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service');
const bcrypt = require('bcrypt')
const postsService = require('./posts.service')

async function getPosts(req, res) {
    try {
        const userId = req.params.id;
        const posts = await postsService.getByIdUser(userId);
        res.send(posts);
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

async function getPost(req, res) {
    try {
        const postId = req.params.id;
        const post = await postsService.getById(postId);
        res.send(posts);
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        await postsService.remove(postId);
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

async function addPost(req, res) {
    try {
        const newPost = req.body.post;
        const addedPost = await postsService.add(newPost);
        res.send(addedPost);
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

async function updatePost(req, res) {
    try {
        const postId = req.params.id;
        const post = await postsService.getById(postId);
        res.send(posts);
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

module.exports = {
    getPosts,
    getPost, 
    deletePost,
    addPost,
    updatePost
}