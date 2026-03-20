const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres.mkjaabclzucbmqkpyxlm:%29y-gH-6bxhLF3CsWBjjxnCSnmw5M5fJYAVv3A%29fh0uVhkNPSA8lvcO5I%2AAgLIqdp@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err.message);
  } else {
    console.log('Connection successful:', res.rows[0]);
  }
  pool.end();
});
