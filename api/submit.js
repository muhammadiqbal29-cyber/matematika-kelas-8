const { getDatabase } = require('./_firebase');
const ANSWER_KEY = [0, 2, 3, 2, 1, 0, 2, 1, 1, 1, 0, 1, 2, 2, 0, 1, 1, 2, 0, 2];

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Metode tidak didukung.' });
  const { attemptId, studentName, className, answers } = req.body || {};
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuid.test(attemptId || '') || typeof studentName !== 'string' || !studentName.trim() || studentName.trim().length > 100 ||
      typeof className !== 'string' || !className.trim() || className.trim().length > 40 ||
      !Array.isArray(answers) || answers.length !== ANSWER_KEY.length ||
      answers.some(answer => answer !== null && (!Number.isInteger(answer) || answer < 0 || answer > 3))) {
    return json(res, 400, { error: 'Data jawaban tidak lengkap atau formatnya keliru.' });
  }

  const correctCount = answers.reduce((total, answer, index) => total + (answer === ANSWER_KEY[index] ? 1 : 0), 0);
  const submission = {
    attemptId,
    studentName: studentName.trim(),
    className: className.trim(),
    answers,
    correctCount,
    score: Math.round(correctCount * 100 / ANSWER_KEY.length),
    createdAt: Date.now()
  };
  try {
    const db = getDatabase();
    const result = await db.ref(`quizSubmissions/${attemptId}`).transaction(current => current || submission, undefined, false);
    if (result.committed) {
      await db.ref('quizSubmissionCount').transaction(count => (Number(count) || 0) + 1, undefined, false);
    }
    return json(res, 200, { ok: true, score: submission.score });
  } catch (error) {
    console.error('Firebase submission failed:', error.message);
    return json(res, 502, { error: 'Jawaban belum tersimpan. Periksa koneksi lalu coba kirim lagi.' });
  }
};
