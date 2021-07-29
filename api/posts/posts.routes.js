const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getPosts, getPost, deletePost, addPost, updatePost, likePost, getTimeline} = require('./posts.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
router.post('/', addPost)

router.get('/', getPosts )
router.put('/:id',requireAuth,  updatePost)
router.delete('/:id',  requireAuth, deletePost)


router.put('/:id/like', requireAuth, likePost)
router.get('/:id', getPost );

router.get('/timeline/all', requireAuth, getTimeline)
//admin route
// router.delete('/admin/:id',  requireAuth, requireAdmin, deleteUser)

module.exports = router