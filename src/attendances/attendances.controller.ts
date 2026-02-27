import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { Prisma } from '@prisma/client';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  create(@Body() createAttendanceDto: Prisma.AttendanceRecordCreateInput) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @Get()
  findAll(@Query('studentId') studentId?: string, @Query('date') date?: string) {
    return this.attendancesService.findAll({ studentId, date });
  }
}
