#!/usr/bin/env node
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const readline = require('readline');

const { upsertAdmin } = require('../src/services/admin-service');

function askQuestion(query, { hidden = false } = {}) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  if (!hidden) {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  return new Promise((resolve) => {
    const onDataHandler = (char) => {
      const key = char.toString();

      if (key === '\r' || key === '\n' || key === '\u0004') {
        process.stdout.write('\n');
      } else {
        process.stdout.write('*');
      }
    };

    process.stdin.on('data', onDataHandler);
    rl.question(query, (answer) => {
      process.stdin.removeListener('data', onDataHandler);
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || (await askQuestion('Admin email: '));
  const password =
    process.argv[3] || process.env.ADMIN_PASSWORD || (await askQuestion('Admin password: ', { hidden: true }));
  const fullName =
    process.argv[4] || process.env.ADMIN_NAME || (await askQuestion('Admin full name (optional): '));

  if (!email || !password) {
    throw new Error('Admin email and password are required');
  }

  const admin = await upsertAdmin({ email, password, fullName });

  console.log(`Admin user saved for ${admin.email}`);
}

main().catch((error) => {
  console.error('Failed to create admin user:', error.message || error);
  process.exitCode = 1;
});
