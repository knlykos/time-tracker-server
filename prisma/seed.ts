import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const usersRoleRel = await prisma.users_role_rel.createMany({
    data: [
      { user_role_id: 1, user_role_name: 'system' },
      { user_role_id: 2, user_role_name: 'user' },
    ],
  });
  const usersStatusRel = await prisma.users_status_rel.createMany({
    data: [
      { user_status_id: 1, user_status_name: 'active' },
      { user_status_id: 2, user_status_name: 'unauthorized' },
      { user_status_id: 3, user_status_name: 'inactive' },
    ],
  });

  const password = 'Nefo123..';
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  const nefi = await prisma.users.upsert({
    where: { email: 'nefi.lopezg@gmail.com' },
    update: {},
    create: {
      email: 'nefi.lopezg@gmail.com',
      group_id: 1,
      username: 'nefi.lopez',
      password: hashedPassword,
      status: 1,
      role_id: 1,
    },
  });

  console.log({ nefi });

  const logsPriorityRel = await prisma.logs_priority_rel.createMany({
    data: [
      { log_priority_name: 'high' },
      { log_priority_name: 'medium' },
      { log_priority_name: 'low' },
    ],
  });
  const logsStatusRel = await prisma.logs_status_rel.createMany({
    data: [{ log_status_name: 'running' }, { log_status_name: 'ended' }],
  });
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
