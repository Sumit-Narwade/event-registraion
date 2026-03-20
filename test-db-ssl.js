const { Pool } = require('pg');

async function test(sslConfig) {
  console.log(`Testing with SSL: ${JSON.stringify(sslConfig)}`);
  const pool = new Pool({
    connectionString: "postgresql://postgres.mkjaabclzucbmqkpyxlm:%29y-gH-6bxhLF3CsWBjjxnCSnmw5M5fJYAVv3A%29fh0uVhkNPSA8lvcO5I%2AAgLIqdp@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
    ssl: sslConfig,
    connectionTimeoutMillis: 5000,
  });

  try {
    const res = await pool.query('SELECT 1');
    console.log('Success!', res.rows[0]);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

(async () => {
  await test({ rejectUnauthorized: false });
  await test(false);
  await test(true);
})();
