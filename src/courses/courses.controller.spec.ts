import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CoursesController],
      providers: [CoursesService],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
