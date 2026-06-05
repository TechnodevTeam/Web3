import { NextResponse } from 'next/server';
import { Pool } from 'pg';
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPassword = password ? password.trim() : '';

    const adminResult = await pool.query(
      `SELECT id, email
       FROM admins 
       WHERE LOWER(email) = $1 AND password = $2`,
      [cleanEmail, cleanPassword]
    );

    if (adminResult.rows.length > 0) {
      return NextResponse.json({
        user: {
          id: adminResult.rows[0].id,
          firstName: 'Admin',
          lastName: 'EventSync',
          email: adminResult.rows[0].email,
          role: 'admin'
        }
      });
    }

    const result = await pool.query(
      `SELECT id, first_name as "firstName", last_name as "lastName", 
              email, role, created_at as "createdAt"
       FROM users 
       WHERE LOWER(email) = $1 AND password = $2`,
      [cleanEmail, cleanPassword]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }
    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
