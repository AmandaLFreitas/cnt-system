import { useState } from 'react';

interface UseCpfValidationReturn {
  maskedCpf: string;
  cpfError: string | null;
  isValidCpf: (cpf: string) => boolean;
  handleCpfChange: (value: string) => string;
  validateCpf: (cpf: string) => boolean;
}

export const useCpfValidation = (): UseCpfValidationReturn => {
  const [maskedCpf, setMaskedCpf] = useState('');
  const [cpfError, setCpfError] = useState<string | null>(null);

  // Remove todos os caracteres que não são dígitos
  const onlyNumbers = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  // Aplica a máscara 000.000.000-00
  const applyCpfMask = (value: string): string => {
    const numbers = onlyNumbers(value);
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  // Valida se o CPF tem todos os números iguais
  const hasAllEqualNumbers = (cpf: string): boolean => {
    const numbers = onlyNumbers(cpf);
    return numbers.length === 11 && /^(\d)\1{10}$/.test(numbers);
  };

  // Calcula o primeiro dígito verificador
  const calculateFirstDigit = (cpf: string): number => {
    let sum = 0;
    let multiplier = 10;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * multiplier;
      multiplier--;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Calcula o segundo dígito verificador
  const calculateSecondDigit = (cpf: string): number => {
    let sum = 0;
    let multiplier = 11;

    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * multiplier;
      multiplier--;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Valida o CPF usando o algoritmo oficial
  const isValidCpf = (cpf: string): boolean => {
    const numbers = onlyNumbers(cpf);

    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) {
      return false;
    }

    // Verifica se todos os números são iguais
    if (hasAllEqualNumbers(numbers)) {
      return false;
    }

    // Calcula e valida o primeiro dígito
    const firstDigit = calculateFirstDigit(numbers);
    if (parseInt(numbers[9]) !== firstDigit) {
      return false;
    }

    // Calcula e valida o segundo dígito
    const secondDigit = calculateSecondDigit(numbers);
    if (parseInt(numbers[10]) !== secondDigit) {
      return false;
    }

    return true;
  };

  // Valida o CPF com feedback de erro
  const validateCpf = (cpf: string): boolean => {
    if (!cpf) {
      setCpfError(null);
      return true; // CPF é opcional
    }

    const numbers = onlyNumbers(cpf);

    if (numbers.length < 11) {
      setCpfError('CPF deve ter 11 dígitos.');
      return false;
    }

    if (hasAllEqualNumbers(numbers)) {
      setCpfError('CPF com números repetidos não é válido.');
      return false;
    }

    if (!isValidCpf(cpf)) {
      setCpfError('CPF inválido. Verifique os dígitos verificadores.');
      return false;
    }

    setCpfError(null);
    return true;
  };

  // Manipula mudanças no input do CPF
  const handleCpfChange = (value: string): string => {
    const masked = applyCpfMask(value);
    setMaskedCpf(masked);
    
    // Limpa o erro enquanto o usuário está digitando
    if (cpfError && masked.length < 14) {
      setCpfError(null);
    }

    return masked;
  };

  return {
    maskedCpf,
    cpfError,
    isValidCpf,
    handleCpfChange,
    validateCpf,
  };
};
