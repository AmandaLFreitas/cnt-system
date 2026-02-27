import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeSlotCapacityDto } from './create-time-slot-capacity.dto';

export class UpdateTimeSlotCapacityDto extends PartialType(CreateTimeSlotCapacityDto) {}
