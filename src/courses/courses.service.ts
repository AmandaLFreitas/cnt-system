import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseCreateInput) {
    return this.prisma.course.create({ data });
  }

  async findAll() {
    return this.prisma.course.findMany();
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }
}
