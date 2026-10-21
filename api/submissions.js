const { timingSafeEqual } = require('node:crypto');
const { getDatabase } = require('../lib/firebaseAdmin');

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Metode tidak didukung.' });
  const expected = process.env.TEACHER_DASHBOARD_PASSWORD || '';
  const provided = String(req.headers['x-teacher-password'] || '');
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (!expected || expectedBuffer.length !== providedBuffer.length || !timingSafeEqual(expectedBuffer, providedBuffer)) {
    return json(res, 401, { error: 'Kata sandi guru salah.' });
  }

  try {
    const db = getDatabase();
    const [snapshot, countSnapshot] = await Promise.all([
      db.ref('quizSubmissions').orderByChild('createdAt').limitToLast(100).once('value'),
      db.ref('quizSubmissionCount').once('value')
    ]);
    const submissions = [];
    snapshot.forEach(child => submissions.push({ id: child.key, ...child.val() }));
    submissions.reverse();
    res.setHeader('Cache-Control', 'no-store');
    return json(res, 200, { submissions, total: Number(countSnapshot.val()) || submissions.length });
  } catch (error) {
    console.error('Firebase dashboard read failed:', error.message);
    return json(res, 502, { error: 'Hasil belum dapat dimuat.' });
  }
};
