import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateTimeSlotCapacityDto {
  @IsString()
  @IsNotEmpty()
  slotId!: string;

  @IsString()
  @IsNotEmpty()
  day!: string;

  @IsString()
  @IsNotEmpty()
  time!: string;

  @IsInt()
  @Min(1)
  totalVacancies!: number;
}
