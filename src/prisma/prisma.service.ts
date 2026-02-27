import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'; // Importe OnModuleDestroy
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy { // Implemente OnModuleDestroy
    async onModuleInit() {
        await this.$connect();
    }

    // Este método é chamado pelo Nest.js automaticamente quando a aplicação é encerrada
    async onModuleDestroy() {
        await this.$disconnect(); // Garante que a conexão do Prisma seja fechada
    }
}