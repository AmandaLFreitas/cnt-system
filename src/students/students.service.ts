import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateStudentDto) {
        const { courseId, ...studentData } = data as any;
        return this.prisma.student.create({
            data: {
                ...studentData,
                course: {
                    connect: { id: courseId }
                }
            },
            include: { course: true }
        });
    }

    async findAll() {
        return this.prisma.student.findMany({ include: { course: true } });
    }

    async findOne(id: string) {
        return this.prisma.student.findUnique({ where: { id }, include: { course: true } });
    }

    async update(id: string, data: UpdateStudentDto) {
        const { courseId, ...studentData } = data as any;
        const updateData: any = { ...studentData };
        
        if (courseId) {
            updateData.course = {
                connect: { id: courseId }
            };
        }
        
        return this.prisma.student.update({ 
            where: { id }, 
            data: updateData,
            include: { course: true }
        });
    }

    async remove(id: string) { // GARANTA que 'id: string' está aqui
        return this.prisma.student.delete({ where: { id } });
    }

    async deleteAll() {
        // DEVELOPMENT ONLY: Delete all students and courses
        await this.prisma.attendanceRecord.deleteMany({});
        await this.prisma.student.deleteMany({});
        await this.prisma.course.deleteMany({});
        return { message: 'Todos os dados foram deletados com sucesso' };
    }
}
