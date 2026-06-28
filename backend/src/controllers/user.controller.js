const userService = require('../services/user.service')

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers()
    const total = users.length
    res.set('Content-Range', `users 0-${total}/${total}`)
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(Number(req.params.id))
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.body)
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function deleteUser(req, res) {
  try {
    await userService.deleteUser(Number(req.params.id))
    res.json({ id: Number(req.params.id) })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser }