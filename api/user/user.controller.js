const userService = require('./user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service');
const bcrypt = require('bcrypt')


async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
            minBalance: +req.query?.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        //get password and update user
        if (req.body._id === req.params.id || req.user.isAdmin) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = req.body;
            const savedUser = await userService.update(user);
            res.send(savedUser)
            // socketService.broadcast({type: 'user-updated', data: review, to:savedUser._id})
        } else {
            return res.status(403).json("you can update only your account!")
        }
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}



async function followUser(req, res) {
    if (req.params.id !== req.body.userId) {
        try {
            const user = await userService.getById(req.params.id)
            const currentUser = await userService.getById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                user.followers.push(currentUser._id)
                currentUser.followings(user._id)
                await userService.update(user);
                await userService.update(currentUser);
                res.send(403).json("user has been followed")
            } else {
                res.send(403).json("you allready follow this user")
            }
        } catch (err) {
            logger.error('Failed to get user', err)
            res.status(500).send({ err: 'Failed to get user' })
        }
    }
}

async function unfollowUser(req, res) {
    if (req.params.id !== req.body.userId) {
        try {
            const user = await userService.getById(req.params.id)
            const currentUser = await userService.getById(req.body.userId)
            const followIdx = user.followers.findIndex( followId => followId === currentUser._id); 
            if (followIdx > -1 ) {
                user.followers.splice(followIdx, 1)
                const followingsIdx = currentUser.followers.findIndex( followId => followId === user._id); 

                currentUser.followings.splice(followingsIdx, 1);
                console.log(`curr: ${currentUser} user: => ${user}`);
                await userService.update(user);
                await userService.update(currentUser);
                res.send(403).json("user has been followed")
            } else {
                res.send(403).json("you allready follow this user")
            }
        } catch (err) {
            logger.error('Failed to get user', err)
            res.status(500).send({ err: 'Failed to get user' })
        }
    }
}

async function freezeUser(req, res) {
    try {
        //get password and update user
        if (req.body._id === req.params.id || req.user.isAdmin) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = req.body;
            user.isActive = false;
            const savedUser = await userService.update(user);
            res.send(savedUser)
            // socketService.broadcast({type: 'user-updated', data: review, to:savedUser._id})
        } else {
            return res.status(403).json("you can update only your account!")
        }
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}


module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    freezeUser,
    followUser,
    unfollowUser
}