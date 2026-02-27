import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentsService } from './students.service';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [StudentsController],
      providers: [StudentsService],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
