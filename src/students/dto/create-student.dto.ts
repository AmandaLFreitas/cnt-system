import { IsString, IsOptional, IsEmail, IsNotEmpty, IsDateString, Matches, Validate } from 'class-validator';
import { IsValidCpfConstraint } from './validators/is-valid-cpf.validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato: XXX.XXX.XXX-XX',
  })
  @Validate(IsValidCpfConstraint)
  cpf?: string;

  @IsOptional()
  @IsString()
  guardian?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsDateString()
  courseStartDate?: string;

  @IsOptional()
  @IsDateString()
  courseEndDate?: string;

  @IsOptional()
  @IsString()
  schedule?: string; // JSON string with schedule data

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'CEP deve estar no formato: XXXXX-XXX',
  })
  cep?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  @IsNotEmpty()
  courseId!: string;
}
