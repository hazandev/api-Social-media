const postsService = require('./posts.service')
const userService = require('../user/user.service')
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
        res.send(post);
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
        const post = req.body;
        const savedPost = await postsService.update(post);
        res.send(savedPost);
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}



async function likePost(req, res) {
    const postId = req.params.id;
    const userId = req.body.userId;
    let post = postsService.getById(postId);
    if (!post.likes.include(userId)) {
        post = await postsService.addLike(post, userId);
    } else {
        post = await postsService.removeLike(post, userId);
    }
    res.send(post)
}

async function getTimeline(req, res) {
    try {
        const currentUser = await userService.getById(req.body.userId);
        const userPosts = await postsService.getByIdUser(userId);
        const friendPosts = await Promis.all(
            currentUser.followings.map((friendId) => {
                return postsService.getByIdUser(friendId);
            })
        );
        res.send(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getPosts,
    getPost,
    deletePost,
    addPost,
    updatePost,
    likePost,
    getTimeline
}