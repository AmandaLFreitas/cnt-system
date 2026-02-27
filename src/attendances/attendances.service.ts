import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AttendanceRecordCreateInput) {
    return this.prisma.attendanceRecord.create({ data });
  }

  async findAll(params?: { studentId?: string; date?: Date | string }) {
    const where: Prisma.AttendanceRecordWhereInput = {};
    if (params?.studentId) where.studentId = params.studentId;
    if (params?.date) where.date = params.date as any;
    return this.prisma.attendanceRecord.findMany({ where });
  }
}
