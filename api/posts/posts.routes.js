const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getPosts, getPost, deletePost, addPost, updatePost} = require('./posts.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
router.post('/', addPost)

router.get('/', getPosts )
router.put('/:id',requireAuth,  updatePost)
router.delete('/:id',  requireAuth, deletePost)



//admin route
// router.delete('/admin/:id',  requireAuth, requireAdmin, deleteUser)

module.exports = router