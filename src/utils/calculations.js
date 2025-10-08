import { SALARIO_MINIMO, JORNADA_MENSAL, DIA_EM_MS } from './constants';
import { formatarMoeda, parseDataBR } from './formatters';

// Calcular salário base total com adicionais
export function calcularSalarioBaseTotal(dados) {
  let total = dados.salarioBase;

  // Horas extras
  if (dados.temHorasExtras && dados.mediaHorasExtras > 0) {
    const valorHoraNormal = dados.salarioBase / JORNADA_MENSAL;
    const valorHoraExtra = valorHoraNormal * (1 + (dados.percentualHE / 100));
    const mediaHEMensal = dados.mediaHorasExtras * valorHoraExtra;
    
    // DSR sobre horas extras (aproximação: 1/6 das horas extras)
    const dsrHE = mediaHEMensal / 6;
    
    total += mediaHEMensal + dsrHE;
  }
  
  // Adicional noturno
  if (dados.temAdicionalNoturno && dados.mediaAdicionalNoturno > 0) {
    total += dados.mediaAdicionalNoturno;
  }
  
  // Insalubridade
  if (dados.temInsalubridade && dados.grauInsalubridade > 0) {
    const baseCalculo = dados.baseInsalubridade === 'salario_minimo' 
      ? SALARIO_MINIMO 
      : dados.salarioBase;
    total += baseCalculo * dados.grauInsalubridade;
  }
  
  // Periculosidade
  if (dados.temPericulosidade) {
    total += dados.salarioBase * 0.30;
  }

  return total;
}

// Calcular meses trabalhados para 13º
export function calcularMesesTrabalhados13(dataAdmissao, dataRescisao) {
  if (!(dataAdmissao instanceof Date) || Number.isNaN(dataAdmissao.getTime())) {
    return null;
  }

  if (!(dataRescisao instanceof Date) || Number.isNaN(dataRescisao.getTime())) {
    return null;
  }

  if (dataRescisao < dataAdmissao) {
    return 0;
  }

  const anoRescisao = dataRescisao.getFullYear();
  const inicioAno = new Date(anoRescisao, 0, 1);
  const inicioContagem = dataAdmissao > inicioAno ? new Date(dataAdmissao) : inicioAno;

  if (inicioContagem > dataRescisao) {
    return 0;
  }

  let meses = 0;
  const cursor = new Date(inicioContagem.getFullYear(), inicioContagem.getMonth(), 1);

  while (cursor.getFullYear() === anoRescisao && cursor <= dataRescisao) {
    const inicioMes = cursor < inicioContagem ? new Date(inicioContagem) : new Date(cursor);
    const fimMes = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const fimConsiderado = fimMes > dataRescisao ? new Date(dataRescisao) : fimMes;

    const diasTrabalhados = Math.floor((fimConsiderado - inicioMes) / DIA_EM_MS) + 1;

    if (diasTrabalhados >= 15) {
      meses += 1;
    }

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return Math.min(meses, 12);
}

// Cálculo de Saldo de Salário
export function calcularSaldoSalario(dados) {
  const valor = dados.salarioBaseTotal * (dados.diasTrabalhadosMes / 30);
  
  return {
    nome: 'Saldo de Salário',
    valor: valor,
    descricao: `Salário proporcional aos ${dados.diasTrabalhadosMes} dias trabalhados no mês da rescisão`,
    formula: `${formatarMoeda(dados.salarioBaseTotal)} × (${dados.diasTrabalhadosMes} ÷ 30) = ${formatarMoeda(valor)}`
  };
}

// Cálculo de Aviso Prévio
export function calcularAvisoPrevio(dados) {
  // Aviso prévio só é devido em demissão sem justa causa
  if (dados.tipoRescisao !== 'sem_justa_causa' && dados.tipoRescisao !== 'acordo') {
    return {
      nome: 'Aviso Prévio Indenizado',
      valor: 0,
      descricao: 'Não aplicável para este tipo de rescisão',
      formula: 'N/A'
    };
  }
  
  const diasAviso = Math.min(30 + (3 * dados.anosCompletos), 90);
  const valor = dados.salarioBaseTotal * (diasAviso / 30);
  
  // Se for acordo (demissão consensual), paga 50%
  const valorFinal = dados.tipoRescisao === 'acordo' ? valor * 0.5 : valor;
  
  return {
    nome: 'Aviso Prévio Indenizado',
    valor: valorFinal,
    descricao: `${diasAviso} dias de aviso prévio (30 dias + ${3 * dados.anosCompletos} dias adicionais)${dados.tipoRescisao === 'acordo' ? ' - 50% (acordo)' : ''}`,
    formula: `${formatarMoeda(dados.salarioBaseTotal)} × (${diasAviso} ÷ 30) = ${formatarMoeda(valorFinal)}`
  };
}

// Cálculo de 13º Salário
export function calcularDecimoTerceiro(dados) {
  let valor = 0;
  let descricao = '';
  let formula = '';
  
  if (dados.tipoRescisao === 'justa_causa') {
    return {
      nome: '13º Salário Proporcional',
      valor: 0,
      descricao: 'Não devido em demissão por justa causa',
      formula: 'N/A'
    };
  }
  
  const valorBase = dados.salarioBaseTotal * (dados.mesesTrabalhados13 / 12);
  valor = valorBase;
  descricao = `13º proporcional a ${dados.mesesTrabalhados13} meses trabalhados no ano`;

  // Se for acordo, paga 50%
  if (dados.tipoRescisao === 'acordo') {
    valor *= 0.5;
    descricao += ' - 50% (acordo)';
  }

  formula = `${formatarMoeda(dados.salarioBaseTotal)} × (${dados.mesesTrabalhados13} ÷ 12) = ${formatarMoeda(valor)}`;
  
  return {
    nome: '13º Salário Proporcional',
    valor: valor,
    descricao: descricao,
    formula: formula
  };
}

// Cálculo de Férias
export function calcularFerias(dados) {
  let valorTotal = 0;
  let descricao = [];
  let formula = [];
  
  // Férias vencidas
  if (dados.feriasVencidas && dados.periodosFeriasVencidas > 0) {
    const valorFeriasVencidas = dados.salarioBaseTotal + (dados.salarioBaseTotal / 3);
    const multiplicador = dados.feriasEmDobro ? 2 : 1;
    const valorPeriodo = valorFeriasVencidas * multiplicador;
    const valorTotalVencidas = valorPeriodo * dados.periodosFeriasVencidas;
    
    valorTotal += valorTotalVencidas;
    descricao.push(`${dados.periodosFeriasVencidas} período(s) de férias vencidas${dados.feriasEmDobro ? ' em dobro' : ''}`);
    formula.push(`(${formatarMoeda(dados.salarioBaseTotal)} + 1/3) × ${multiplicador} × ${dados.periodosFeriasVencidas} = ${formatarMoeda(valorTotalVencidas)}`);
  }
  
  // Férias proporcionais
  if (dados.tipoRescisao !== 'justa_causa' && dados.mesesTrabalhadosProporcionais > 0) {
    const valorProporcionais = dados.salarioBaseTotal * (dados.mesesTrabalhadosProporcionais / 12);
    const valorComTerco = valorProporcionais + (valorProporcionais / 3);
    
    // Se for acordo, paga 50%
    const valorFinal = dados.tipoRescisao === 'acordo' ? valorComTerco * 0.5 : valorComTerco;
    
    valorTotal += valorFinal;
    descricao.push(`Férias proporcionais (${dados.mesesTrabalhadosProporcionais}/12 + 1/3)${dados.tipoRescisao === 'acordo' ? ' - 50% (acordo)' : ''}`);
    formula.push(`${formatarMoeda(dados.salarioBaseTotal)} × (${dados.mesesTrabalhadosProporcionais} ÷ 12) × 1,333 = ${formatarMoeda(valorFinal)}`);
  }
  
  return {
    nome: 'Férias (Vencidas + Proporcionais + 1/3)',
    valor: valorTotal,
    descricao: descricao.join(' | '),
    formula: formula.join(' + ')
  };
}

// Cálculo de FGTS
export function calcularFGTS(dados) {
  let multaPercentual = 0;
  let descricao = '';
  
  switch (dados.tipoRescisao) {
    case 'sem_justa_causa':
      multaPercentual = 0.40;
      descricao = 'Multa de 40% sobre o saldo do FGTS';
      break;
    case 'acordo':
      multaPercentual = 0.20;
      descricao = 'Multa de 20% sobre o saldo do FGTS (acordo)';
      break;
    case 'culpa_reciproca':
      multaPercentual = 0.20;
      descricao = 'Multa de 20% sobre o saldo do FGTS (culpa recíproca)';
      break;
    default:
      multaPercentual = 0;
      descricao = 'Sem multa de FGTS para este tipo de rescisão';
  }
  
  const valor = dados.saldoFGTS * multaPercentual;
  
  return {
    nome: 'Multa do FGTS',
    valor: valor,
    descricao: descricao,
    formula: `${formatarMoeda(dados.saldoFGTS)} × ${(multaPercentual * 100).toFixed(0)}% = ${formatarMoeda(valor)}`
  };
}

// Calcular total recebido
export function calcularTotalRecebido(dados) {
  const valores = dados.valoresRecebidos;
  return valores.saldoSalario + valores.avisoPrevio + valores.decimoTerceiro + 
         valores.ferias + valores.multaFGTS;
}

// Função principal de cálculo
export function calcularRescisao(formData) {
  // Processar datas
  const dataAdmissao = parseDataBR(formData.dataAdmissao);
  const dataRescisao = parseDataBR(formData.dataRescisao);

  if (!dataAdmissao || !dataRescisao) {
    throw new Error('Informe datas válidas no formato dd/mm/aaaa.');
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (dataRescisao > hoje) {
    throw new Error('A data de rescisão não pode ser no futuro.');
  }

  if (dataRescisao < dataAdmissao) {
    throw new Error('A data de rescisão deve ser posterior à data de admissão.');
  }

  // Calcular tempo de serviço
  const diffTime = Math.abs(dataRescisao - dataAdmissao);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const anosCompletos = Math.floor(diffMonths / 12);

  const dados = {
    ...formData,
    dataAdmissao,
    dataRescisao,
    anosCompletos,
    mesesCompletos: diffMonths,
  };

  // Calcular salário base total
  dados.salarioBaseTotal = calcularSalarioBaseTotal(dados);

  // Calcular cada verba
  const calculos = {
    saldoSalario: calcularSaldoSalario(dados),
    avisoPrevio: calcularAvisoPrevio(dados),
    decimoTerceiro: calcularDecimoTerceiro(dados),
    ferias: calcularFerias(dados),
    fgts: calcularFGTS(dados)
  };

  // Calcular totais
  const totalDevido = Object.values(calculos).reduce((acc, val) => acc + val.valor, 0);
  const totalRecebido = calcularTotalRecebido(dados);
  const diferenca = totalDevido - totalRecebido;

  return {
    calculos,
    totalDevido,
    totalRecebido,
    diferenca,
    dados
  };
}

