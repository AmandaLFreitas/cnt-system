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
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotCapacityDto } from './dto/create-time-slot-capacity.dto';
import { UpdateTimeSlotCapacityDto } from './dto/update-time-slot-capacity.dto';

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTimeSlotCapacityDto: CreateTimeSlotCapacityDto) {
    return this.timeSlotsService.createCapacity(createTimeSlotCapacityDto);
  }

  @Get()
  findAll() {
    return this.timeSlotsService.findAllCapacities();
  }

  @Get('day/:day')
  findByDay(@Param('day') day: string) {
    return this.timeSlotsService.findByDay(day);
  }

  @Get(':slotId')
  findOne(@Param('slotId') slotId: string) {
    return this.timeSlotsService.findBySlotId(slotId);
  }

  @Patch(':slotId')
  update(
    @Param('slotId') slotId: string,
    @Body() updateTimeSlotCapacityDto: UpdateTimeSlotCapacityDto
  ) {
    return this.timeSlotsService.updateCapacity(slotId, updateTimeSlotCapacityDto);
  }

  @Delete(':slotId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('slotId') slotId: string) {
    return this.timeSlotsService.deleteCapacity(slotId);
  }

  @Post('initialize-defaults')
  @HttpCode(HttpStatus.CREATED)
  async initializeDefaults() {
    await this.timeSlotsService.initializeDefaultCapacities();
    return { message: 'Vagas padrão inicializadas' };
  }
}
