import { PrismaClient } from "./db/client";
import { PrismaLibSql } from "@prisma/adapter-libsql"
import path from 'path'

const url = path.join(process.env.DATABASE_DIR, 'panel.db');
console.log(url)
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

// 测试数据库连接
prisma.$connect()
  .then(() => console.log('✅ Prisma 已连接到数据库'))
  .catch((error) => console.error('❌ Prisma 连接失败:', error))

export default prisma;