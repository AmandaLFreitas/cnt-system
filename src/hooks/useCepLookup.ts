import { useState } from 'react';

interface CepData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface UseCepLookupReturn {
  loadingCep: boolean;
  cepError: string | null;
  lookupCep: (cep: string) => Promise<CepData | null>;
}

export const useCepLookup = (): UseCepLookupReturn => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const validateCep = (cep: string): boolean => {
    // Remove caracteres especiais
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  };

  const lookupCep = async (cep: string): Promise<CepData | null> => {
    setCepError(null);
    setLoadingCep(true);

    try {
      // Validar CEP
      if (!validateCep(cep)) {
        setCepError('CEP deve conter 8 dígitos.');
        setLoadingCep(false);
        return null;
      }

      // Remover caracteres especiais
      const cleanCep = cep.replace(/\D/g, '');

      // Fazer requisição para ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (!response.ok) {
        throw new Error('Erro ao buscar CEP');
      }

      const data = await response.json();

      // Verificar se o CEP não foi encontrado
      if (data.erro) {
        setCepError('CEP não encontrado.');
        setLoadingCep(false);
        return null;
      }

      setLoadingCep(false);

      return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      };
    } catch (error) {
      setCepError('Erro ao buscar CEP. Tente novamente.');
      setLoadingCep(false);
      return null;
    }
  };

  return {
    loadingCep,
    cepError,
    lookupCep,
  };
};
