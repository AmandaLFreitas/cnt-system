import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSlotCapacityDto } from './dto/create-time-slot-capacity.dto';
import { UpdateTimeSlotCapacityDto } from './dto/update-time-slot-capacity.dto';

@Injectable()
export class TimeSlotsService {
  constructor(private prisma: PrismaService) {}

  async createCapacity(data: CreateTimeSlotCapacityDto) {
    return this.prisma.timeSlotCapacity.create({ data });
  }

  async findAllCapacities() {
    return this.prisma.timeSlotCapacity.findMany({
      orderBy: { day: 'asc' }
    });
  }

  async findByDay(day: string) {
    return this.prisma.timeSlotCapacity.findMany({
      where: { day },
      orderBy: { slotId: 'asc' }
    });
  }

  async findBySlotId(slotId: string) {
    return this.prisma.timeSlotCapacity.findUnique({
      where: { slotId }
    });
  }

  async updateCapacity(slotId: string, data: UpdateTimeSlotCapacityDto) {
    return this.prisma.timeSlotCapacity.update({
      where: { slotId },
      data
    });
  }

  async deleteCapacity(slotId: string) {
    return this.prisma.timeSlotCapacity.delete({
      where: { slotId }
    });
  }

  // Inicializar vagas padrão
  async initializeDefaultCapacities() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday'];
    const timeSlots = [
      { start: '08', end: '09' },
      { start: '09', end: '10' },
      { start: '10', end: '11' },
      { start: '13', end: '14' },
      { start: '14', end: '15' },
      { start: '15', end: '16' },
      { start: '16', end: '17' }
    ];

    // Resetar todas as vagas existentes para 20
    await this.prisma.timeSlotCapacity.updateMany({ data: { totalVacancies: 20 } });

    for (const day of days) {
      for (const slot of timeSlots) {
        const slotId = `${day.substring(0, 3)}-${slot.start}-${slot.end}`;
        const time = `${slot.start}:00 - ${slot.end}:00`;

        // Verifica se já existe
        const exists = await this.prisma.timeSlotCapacity.findUnique({
          where: { slotId }
        });

        if (!exists) {
          await this.prisma.timeSlotCapacity.create({
            data: {
              slotId,
              day,
              time,
              totalVacancies: 20 // Vagas padrão
            }
          });
        }
      }
    }
  }
}
