import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidCpf', async: false })
export class IsValidCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments) {
    if (!cpf) {
      return true; // CPF é opcional
    }

    // Remove caracteres especiais
    const numbers = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) {
      return false;
    }

    // Verifica se todos os números são iguais
    if (/^(\d)\1{10}$/.test(numbers)) {
      return false;
    }

    // Calcula o primeiro dígito verificador
    let sum = 0;
    let multiplier = 10;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * multiplier;
      multiplier--;
    }
    const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    // Verifica o primeiro dígito
    if (parseInt(numbers[9]) !== firstDigit) {
      return false;
    }

    // Calcula o segundo dígito verificador
    sum = 0;
    multiplier = 11;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * multiplier;
      multiplier--;
    }
    const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    // Verifica o segundo dígito
    if (parseInt(numbers[10]) !== secondDigit) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'CPF inválido';
  }
}
