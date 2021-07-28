
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getByIdUser,
    getById,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find({ 'isActive': true }).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
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

async function update(user) {
    try {
        // peek only updatable fields!
        const userToSave = {
            id: user._id,
            username: user.username,
            password: user.password,
            mail: user.mail,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            followers: user.followers,
            followings: user.followings,
            isAdmin: user.isAdmin,
            desc: user.desc,
            city: user.city,
            from: user.from,
            relationship: 'signal',
            timestamp: new Date(),
            isActive: true
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

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

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}


