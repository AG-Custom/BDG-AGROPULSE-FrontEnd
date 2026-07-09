import type { ViaCepResponseDto } from 'types/api/viacep.dto';

const VIA_CEP_BASE_URL = 'https://viacep.com.br/ws';

export const viacepService = {
  async buscar(cep: string): Promise<ViaCepResponseDto> {
    const response = await fetch(`${VIA_CEP_BASE_URL}/${cep}/json/`);

    if (!response.ok) {
      throw new Error('Falha ao consultar CEP');
    }

    return response.json() as Promise<ViaCepResponseDto>;
  },
};
