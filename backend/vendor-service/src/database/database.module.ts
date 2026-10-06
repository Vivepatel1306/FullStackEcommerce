import {
  Global,
  Injectable,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
 
  constructor() {
    const connectionString = process.env["DATABASE_URL"];

    // 1. Create explicit pg Pool instance with SSL enabled
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // 2. Pass the configured pool instance into PrismaPg
    const adapter = new PrismaPg(pool);

    super({ adapter });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // 3. Clean up the database connection pool on app shutdown
    await this.pool.end();
  }
}

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class DatabaseModule {}