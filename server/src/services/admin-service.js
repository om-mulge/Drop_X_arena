const { supabase } = require('../config/supabase');
const { hashPassword, verifyPassword } = require('../lib/password');

const TABLE_NAME = 'admin';

function sanitizeAdmin(admin) {
  if (!admin) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    fullName: admin.full_name,
    isActive: admin.is_active,
    createdAt: admin.created_at,
    updatedAt: admin.updated_at,
  };
}

async function findAdminByEmail(email) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function findAdminById(id) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function authenticateAdmin(email, password) {
  const admin = await findAdminByEmail(email);

  if (!admin || !admin.is_active) {
    return null;
  }

  const passwordMatches = await verifyPassword(password, admin.password_hash);

  if (!passwordMatches) {
    return null;
  }

  return sanitizeAdmin(admin);
}

async function upsertAdmin({ email, password, fullName }) {
  const passwordHash = await hashPassword(password);
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        email: normalizedEmail,
        full_name: fullName?.trim() || null,
        password_hash: passwordHash,
        is_active: true,
      },
      {
        onConflict: 'email',
      },
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return sanitizeAdmin(data);
}

module.exports = {
  TABLE_NAME,
  authenticateAdmin,
  findAdminById,
  upsertAdmin,
};
