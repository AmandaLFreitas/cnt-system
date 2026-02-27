import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesController } from './attendances.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AttendancesService } from './attendances.service';

describe('AttendancesController', () => {
  let controller: AttendancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AttendancesController],
      providers: [AttendancesService],
    }).compile();

    controller = module.get<AttendancesController>(AttendancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
