const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    

    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_dev',
      { expiresIn: '8h' }
    )

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router
