#!/usr/bin/env node
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');

async function runAdminSchema() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const projectRefMatch = (process.env.SUPABASE_URL || '').match(/https:\/\/([^.]+)\.supabase\.co/i);
  const projectRef = process.env.SUPABASE_PROJECT_REF || projectRefMatch?.[1];

  if (!accessToken || !projectRef) {
    throw new Error(
      'SUPABASE_ACCESS_TOKEN and a project ref are required to run schema automatically. The SQL file is ready at server/sql/create-admin-table.sql.',
    );
  }

  const query = fs.readFileSync(path.join(__dirname, '..', 'sql', 'create-admin-table.sql'), 'utf8');
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Schema request failed (${response.status}): ${errorText}`);
  }

  console.log('Admin table schema executed successfully.');
}

module.exports = {
  runAdminSchema,
};

if (require.main === module) {
  runAdminSchema().catch((error) => {
    console.error('Failed to execute admin schema:', error.message || error);
    process.exitCode = 1;
  });
}
