// Constantes do sistema
export const SALARIO_MINIMO = 1412.00;
export const JORNADA_MENSAL = 220; // 44h semanais
export const DIA_EM_MS = 1000 * 60 * 60 * 24;

export const TIPOS_RESCISAO = {
  SEM_JUSTA_CAUSA: 'sem_justa_causa',
  PEDIDO_DEMISSAO: 'pedido_demissao',
  JUSTA_CAUSA: 'justa_causa',
  ACORDO: 'acordo',
  CULPA_RECIPROCA: 'culpa_reciproca'
};

export const GRAUS_INSALUBRIDADE = [
  { value: '10', label: 'Mínimo (10%)' },
  { value: '20', label: 'Médio (20%)' },
  { value: '40', label: 'Máximo (40%)' }
];

export const BASE_INSALUBRIDADE = [
  { value: 'salario_minimo', label: 'Salário Mínimo' },
  { value: 'salario_base', label: 'Salário Base' }
];

