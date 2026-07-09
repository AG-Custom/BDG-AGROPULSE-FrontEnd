export interface ViaCepEnderecoDto {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface ViaCepNaoEncontradoDto {
  erro: true;
}

export type ViaCepResponseDto = ViaCepEnderecoDto | ViaCepNaoEncontradoDto;

export function isViaCepNaoEncontrado(
  resposta: ViaCepResponseDto,
): resposta is ViaCepNaoEncontradoDto {
  return 'erro' in resposta;
}
