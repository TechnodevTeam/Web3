const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const [events, sessions, speakers, questions] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM events'),
      pool.query('SELECT COUNT(*) FROM sessions'),
      pool.query('SELECT COUNT(*) FROM speakers'),
      pool.query('SELECT COUNT(*) FROM questions'),
    ])

    const liveSessions = await pool.query(`
      SELECT COUNT(*) FROM sessions
      WHERE CURRENT_TIMESTAMP BETWEEN start_time AND end_time
    `)

    res.json({
      events: parseInt(events.rows[0].count),
      sessions: parseInt(sessions.rows[0].count),
      speakers: parseInt(speakers.rows[0].count),
      questions: parseInt(questions.rows[0].count),
      liveSessions: parseInt(liveSessions.rows[0].count),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router