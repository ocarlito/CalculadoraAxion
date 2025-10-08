// Formatadores de valores
export const formatterBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export function formatarMoeda(valor) {
  return formatterBRL.format(valor || 0);
}

export function aplicarMascaraData(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')
    .substring(0, 10);
}

export function parseDataBR(valor) {
  if (!valor) return null;
  if (valor.length !== 10) return null;

  const partes = valor.split('/');
  if (partes.length !== 3) return null;

  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // zero-based
  const ano = parseInt(partes[2], 10);

  if (Number.isNaN(dia) || Number.isNaN(mes) || Number.isNaN(ano)) {
    return null;
  }

  const data = new Date(ano, mes, dia);

  if (data.getFullYear() !== ano || data.getMonth() !== mes || data.getDate() !== dia) {
    return null;
  }

  data.setHours(0, 0, 0, 0);
  return data;
}

export function dataBRValida(valor) {
  const data = parseDataBR(valor);
  return data instanceof Date && !Number.isNaN(data.getTime());
}

export function formatarData(data) {
  if (!(data instanceof Date)) return '';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

