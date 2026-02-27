import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students') // Prefixo da rota: /students
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
    create(@Body() createStudentDto: CreateStudentDto) {
        return this.studentsService.create(createStudentDto);
    }

    @Get()
    findAll() {
        return this.studentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
        return this.studentsService.update(id, updateStudentDto);
    }

    @Delete('__reset/__all')
    @HttpCode(HttpStatus.OK)
    async resetAll() {
        // DEVELOPMENT ONLY: Delete all students and courses
        return this.studentsService.deleteAll();
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content
    remove(@Param('id') id: string) {
        return this.studentsService.remove(id);
    }
}