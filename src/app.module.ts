import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { AttendancesModule } from './attendances/attendances.module';
import { PrismaModule } from './prisma/prisma.module';
import { TimeSlotsModule } from './time-slots/time-slots.module';

@Module({
  imports: [
      PrismaModule,
      StudentsModule,
      CoursesModule,
      AttendancesModule,
      TimeSlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
