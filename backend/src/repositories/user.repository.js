const db = require('../db')

async function findAllUsers() {
  const result = await db.query(`
    SELECT id, first_name AS "firstName", last_name AS "lastName",
           email, role, created_at AS "createdAt"
    FROM users ORDER BY id
  `)
  return result.rows
}

async function findUserById(id) {
  const result = await db.query(`
    SELECT id, first_name AS "firstName", last_name AS "lastName",
           email, role, created_at AS "createdAt"
    FROM users WHERE id = $1
  `, [id])
  return result.rows[0]
}

async function createUser({ firstName, lastName, email, password, role }) {
  const result = await db.query(`
    INSERT INTO users (first_name, last_name, email, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name AS "firstName", last_name AS "lastName",
              email, role, created_at AS "createdAt"
  `, [firstName, lastName, email, password, role || 'admin'])
  return result.rows[0]
}

async function updateUser(id, { firstName, lastName, email, password, role }) {
  const result = await db.query(`
    UPDATE users SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      email = COALESCE($3, email),
      password = COALESCE($4, password),
      role = COALESCE($5, role)
    WHERE id = $6
    RETURNING id, first_name AS "firstName", last_name AS "lastName",
              email, role, created_at AS "createdAt"
  `, [firstName, lastName, email, password, role, id])
  return result.rows[0]
}

async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = $1', [id])
  return true
}

module.exports = { findAllUsers, findUserById, createUser, updateUser, deleteUser }