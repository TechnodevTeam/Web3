const userRepository = require('../repositories/user.repository')
const bcrypt = require('bcrypt')

async function getAllUsers() {
  return userRepository.findAllUsers()
}

async function getUserById(id) {
  return userRepository.findUserById(id)
}

async function createUser({ firstName, lastName, email, password, role }) {
  if (!email || !password) throw new Error('Email et mot de passe requis')
  const hashedPassword = await bcrypt.hash(password, 10)
  return userRepository.createUser({ firstName, lastName, email, password: hashedPassword, role })
}

async function updateUser(id, { firstName, lastName, email, password, role }) {
  let hashedPassword = undefined
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10)
  }
  return userRepository.updateUser(id, { firstName, lastName, email, password: hashedPassword, role })
}

async function deleteUser(id) {
  return userRepository.deleteUser(id)
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser }