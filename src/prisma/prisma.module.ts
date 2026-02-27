import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//@Global() decorator torna o PrismaService disponivel para a injeção
// em qualquer lugar da aplicação sem pricesa ficar importando

@Global()
@Module({
    providers: [PrismaService], //provedor
    exports: [PrismaService], //exportado para ser usado em outros modulos
})
export class PrismaModule {}
