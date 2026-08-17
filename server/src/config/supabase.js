const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

function normalizeSupabaseUrl(url) {
  if (!url) {
    return 'https://mkhxtryczbodrbynvddl.supabase.co';
  }

  return url.replace(/\/rest\/v1\/?$/, '');
}

const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = { supabase };
