const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers)
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById)
router.post('/', authMiddleware, adminMiddleware, userController.createUser)
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser)
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser)

module.exports = router