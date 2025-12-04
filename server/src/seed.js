// seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Hash Password
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@balwana.com" },
    update: {},
    create: {
      email: "admin@balwana.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
