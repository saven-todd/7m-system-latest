import bcrypt from "bcryptjs";

async function run() {
  const password = "1234";
  const hashed = await bcrypt.hash(password, 10);
  console.log("HASH:", hashed);
}

run();