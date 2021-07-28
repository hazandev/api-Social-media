const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(mail, password) {
    logger.debug(`auth.service - login with mail: ${mail}`)

    const user = await userService.getByMail(mail)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid mail or password')

    delete user.password
    return user
}

async function signup(mail, username, password) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, mail: ${mail}`)
    if (!username || !password || !mail) return Promise.reject('mail, username and password are required!')

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return userService.add({ mail, username, password: hashedPassword })
}

module.exports = {
    signup,
    login,
}