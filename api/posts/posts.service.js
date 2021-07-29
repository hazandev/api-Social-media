
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    getByIdUser,
    getById,
    remove,
    update,
    add,
    addLike,
    removeLike,
}



async function getByIdUser(userId) {
    try {
        const collection = await dbService.getCollection('posts')
        const userPosts = await collection.find({ 'userId': ObjectId(userId) })
        return userPosts
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getById(postId) {
    try {
        const collection = await dbService.getCollection('posts');
        const post = await collection.findOne({ '_id': ObjectId(postId) });
        return post;
    } catch (err) {
        logger.error(`while finding post ${postId}`, err)
        throw err
    }
}



async function remove(postId) {
    try {
        const collection = await dbService.getCollection('posts')
        await collection.deleteOne({ '_id': ObjectId(postId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

//update a post
async function update(post) {
    try {
        // peek only updatable fields!
        const postToUpdate = {
            userId: post.userId,
            desc: post.desc,
            img: post.img,
            likes: post.likes,
            timestamp: new Date.now()
        }
        const collection = await dbService.getCollection('post')
        await collection.updateOne({ '_id': post._id }, { $set: postToUpdate })
        return postToUpdate;
    } catch (err) {
        logger.error(`cannot update user ${post._id}`, err)
        throw err
    }
}

//add a post

async function add(post) {
    try {
        // peek only updatable fields!
        const postToAdd = {
            userId: post.userId,
            desc: post.desc,
            img: post.img,
            likes: [],
            timestamp: new Date.now()
        }
        const collection = await dbService.getCollection('posts')
        await collection.insertOne(postToAdd)
        return postToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}


//like 

async function addLike(post, userId) {
    try {
        const collection = await dbService.getCollection('posts');
        collection.updateOne({ '_id': post._id }, { $push: { likes: userId } });
        post.likes.push(userId);
    } catch (err) {
        logger.error(`cannot add like to post ${post._id}`, err)
        throw err
    }
}



async function removeLike(post, userId) {
    try {
        const collection = await dbService.getCollection('posts');
        const updatePost = await collection.updateOne({ '_id': post._id }, { $pull: { likes: userId } })
        return updatePost;
    } catch (err) {
        logger.error(`cannot remove post ${post._id}`, err)
        throw err
    }
}