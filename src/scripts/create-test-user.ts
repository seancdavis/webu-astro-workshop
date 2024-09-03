import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("SUPABASE_URL or SUPABASE_KEY is not set");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function run() {
  const testUserEmail = process.env.TEST_USER_EMAIL;
  if (!testUserEmail) {
    throw new Error("TEST_USER_EMAIL is not set");
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: testUserEmail,
    email_confirm: true,
    user_metadata: {
      first_name: "Admin",
      last_name: "User",
    },
  });

  if (error) {
    throw error;
  }

  console.log("Test user created");
}

run();
