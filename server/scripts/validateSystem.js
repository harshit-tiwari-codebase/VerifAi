require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');

async function runSystemDiagnostics() {
  const results = {};
  console.log('==============================================');
  console.log('       VERIFAI SYSTEM HEALTH CHECK            ');
  console.log('==============================================\n');

  // 1. Check MongoDB
  try {
    const mongoStart = Date.now();
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    const challengeCount = await mongoose.connection.db.collection('challenges').countDocuments();
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    const submissionCount = await mongoose.connection.db.collection('submissions').countDocuments();
    results.mongo = {
      status: 'OK',
      latency: `${Date.now() - mongoStart}ms`,
      challenges: challengeCount,
      users: userCount,
      submissions: submissionCount,
    };
    console.log('✅ 1. MongoDB Connection: SUCCESS', results.mongo);
  } catch (err) {
    results.mongo = { status: 'FAILED', error: err.message };
    console.error('❌ 1. MongoDB Connection: FAILED', err.message);
  }

  // 2. Check Local Judge0 Docker
  try {
    const judgeStart = Date.now();
    const aboutRes = await axios.get('http://localhost:2358/about', { timeout: 3000 });
    const runRes = await axios.post('http://localhost:2358/submissions?base64_encoded=false&wait=true', {
      source_code: 'console.log("HEALTH_CHECK_OK");',
      language_id: 63,
    }, { timeout: 60000 });
    results.judge0 = {
      status: 'OK',
      version: aboutRes.data.version,
      execution: runRes.data.status.description,
      stdout: runRes.data.stdout?.trim(),
      latency: `${Date.now() - judgeStart}ms`,
    };
    console.log('✅ 2. Local Judge0 Sandbox: SUCCESS', results.judge0);
  } catch (err) {
    results.judge0 = { status: 'FAILED', error: err.message };
    console.error('❌ 2. Local Judge0 Sandbox: FAILED', err.message);
  }

  // 3. Check Redis Queues
  try {
    const eq = require('../src/queues/execution.queue');
    const aiq = require('../src/queues/aiEvaluation.queue');
    await Promise.all([eq.getQueue().isReady(), aiq.getQueue().isReady()]);
    results.queues = {
      status: 'OK',
      executionQueue: eq.isQueueAvailable(),
      aiEvaluationQueue: aiq.isQueueAvailable(),
    };
    console.log('✅ 3. Redis Job Queues: SUCCESS', results.queues);
  } catch (err) {
    results.queues = { status: 'FAILED', error: err.message };
    console.error('❌ 3. Redis Job Queues: FAILED', err.message);
  }

  // 4. Check Gemini 3.8 Flash AI Evaluator
  try {
    const { evaluateSubmissionWithAi } = require('../src/utils/aiEvaluator');
    const evalStart = Date.now();
    const aiRes = await evaluateSubmissionWithAi({
      code: 'function add(a, b) { return a + b; }',
      language: 'javascript',
      challenge: { title: 'Addition' },
      testSummary: { passedCount: 1, totalCount: 1 },
    });
    results.gemini = {
      status: 'OK',
      version: aiRes.evaluatorVersion,
      codeQuality: aiRes.codeQuality,
      latency: `${Date.now() - evalStart}ms`,
    };
    console.log('✅ 4. Gemini AI Review Engine: SUCCESS', results.gemini);
  } catch (err) {
    results.gemini = { status: 'FAILED', error: err.message };
    console.error('❌ 4. Gemini AI Review Engine: FAILED', err.message);
  }

  // 5. Check End-to-End Submission Execution Harness
  try {
    const { executeSubmissionAgainstChallenge } = require('../src/utils/codeExecutor');
    const execStart = Date.now();
    const challengeDoc = await mongoose.connection.db.collection('challenges').findOne({ executionType: 'testcases' });
    if (challengeDoc && challengeDoc.testCases?.length > 0) {
      const code = challengeDoc.starterCode?.javascript || challengeDoc.solutionSkeleton?.javascript || 'function solution() { return true; }';
      const execRes = await executeSubmissionAgainstChallenge({
        code,
        language: 'javascript',
        challenge: challengeDoc,
      });
      results.endToEndExecution = {
        status: 'OK',
        challengeId: challengeDoc._id,
        title: challengeDoc.title,
        execStatus: execRes.status,
        latency: `${Date.now() - execStart}ms`,
      };
      console.log('✅ 5. End-to-End Test Runner: SUCCESS', results.endToEndExecution);
    } else {
      results.endToEndExecution = { status: 'SKIPPED', reason: 'No testcases challenge found' };
      console.log('⚠️ 5. End-to-End Test Runner: SKIPPED');
    }
  } catch (err) {
    results.endToEndExecution = { status: 'FAILED', error: err.message };
    console.error('❌ 5. End-to-End Test Runner: FAILED', err.message);
  }

  // 6. Check Auth Token Generation & Verification
  try {
    const testPayload = { id: new mongoose.Types.ObjectId(), role: 'user' };
    const token = jwt.sign(testPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    results.auth = {
      status: 'OK',
      verifiedId: verified.id,
      matches: verified.id === testPayload.id.toString(),
    };
    console.log('✅ 6. JWT Auth & Cryptography: SUCCESS', results.auth);
  } catch (err) {
    results.auth = { status: 'FAILED', error: err.message };
    console.error('❌ 6. JWT Auth & Cryptography: FAILED', err.message);
  }

  console.log('\n==============================================');
  console.log('               OVERALL STATUS                 ');
  console.log('==============================================');

  const allPassed = Object.values(results).every(r => r.status === 'OK' || r.status === 'SKIPPED');
  console.log('System Status:', allPassed ? 'ALL SYSTEMS OPERATIONAL ✅' : 'SOME ISSUES DETECTED ❌');

  await mongoose.disconnect();
  process.exit(allPassed ? 0 : 1);
}

runSystemDiagnostics();
