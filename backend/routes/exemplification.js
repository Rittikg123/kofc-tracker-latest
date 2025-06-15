import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Validate required fields
    const requiredFields = [
      'council', 'event_date', 'event_time', 'location_name', 'location_address',
      'location_city', 'location_zipcode', 'contact_name', 'contact_phone', 'contact_email'
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const query = `
      INSERT INTO exemps (
        council, event_date, event_time, location_name, location_address, location_city,
        location_zipcode, note, contact_name, contact_phone, contact_email, status,
        new_members, e_members, total_attendees, reporting_user, reporting_date,
        creation_user, creation_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      RETURNING *;
    `;

    const values = [
      req.body.council,
      req.body.event_date,
      req.body.event_time,
      req.body.location_name,
      req.body.location_address,
      req.body.location_city,
      req.body.location_zipcode,
      req.body.note || null,
      req.body.contact_name,
      req.body.contact_phone,
      req.body.contact_email,
      req.body.status || null,
      req.body.new_members ? parseInt(req.body.new_members) : null,
      req.body.e_members ? parseInt(req.body.e_members) : null,
      req.body.total_attendees ? parseInt(req.body.total_attendees) : null,
      req.body.reporting_user,
      req.body.reporting_date,
      'web_user',
      new Date()
    ];

    const result = await client.query(query, values);
    await client.query('COMMIT');

    if (!result.rows.length) {
      res.status(500).json({ success: false, error: 'Insert failed', details: 'No row returned from insert.' });
      return;
    }

    console.log('Insert successful:', result.rows[0]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database insert error:', err);
    res.status(500).json({
      success: false,
      error: 'Database insert failed',
      details: err.message
    });
  } finally {
    client.release();
  }
});

export default router;