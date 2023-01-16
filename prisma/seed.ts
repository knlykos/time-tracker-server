import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const password = 'Nefo123..';
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  console.log(hashedPassword);
  const nefi = await prisma.users.upsert({
    where: { email: 'nefi.lopezg@gmail.com' },
    update: {},
    create: {
      email: 'nefi.lopezg@gmail.com',
      group_id: 1,
      username: 'nefi.lopez',
      password: hashedPassword,
    },
  });
  console.log({ nefi });
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
