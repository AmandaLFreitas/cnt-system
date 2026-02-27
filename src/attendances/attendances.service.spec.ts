import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('AttendancesService', () => {
  let service: AttendancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AttendancesService],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
