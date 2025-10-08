import React from 'react';
import { FormInput, FormSelect } from './FormInput';
import { aplicarMascaraData } from '../utils/formatters';

export function Step1({ formData, updateFormData, nextStep }) {
  const handleDateChange = (field) => (e) => {
    const masked = aplicarMascaraData(e.target.value);
    updateFormData({ [field]: masked });
  };

  const tiposRescisao = [
    { value: '', label: 'Selecione...' },
    { value: 'sem_justa_causa', label: 'Demissão sem Justa Causa' },
    { value: 'pedido_demissao', label: 'Pedido de Demissão' },
    { value: 'justa_causa', label: 'Demissão por Justa Causa' },
    { value: 'acordo', label: 'Acordo (Demissão Consensual)' },
    { value: 'culpa_reciproca', label: 'Culpa Recíproca' }
  ];

  return (
    <section className="form-section active">
      <h2>Dados Básicos do Contrato</h2>
      
      <FormInput
        label="Data de Admissão"
        id="dataAdmissao"
        value={formData.dataAdmissao}
        onChange={handleDateChange('dataAdmissao')}
        placeholder="dd/mm/aaaa"
        maxLength="10"
        inputMode="numeric"
        tooltip="Data em que você começou a trabalhar na empresa"
        required
      />

      <FormInput
        label="Data da Rescisão"
        id="dataRescisao"
        value={formData.dataRescisao}
        onChange={handleDateChange('dataRescisao')}
        placeholder="dd/mm/aaaa"
        maxLength="10"
        inputMode="numeric"
        tooltip="Data do último dia trabalhado ou da comunicação do desligamento"
        required
      />

      <FormSelect
        label="Tipo de Rescisão"
        id="tipoRescisao"
        value={formData.tipoRescisao}
        onChange={(e) => updateFormData({ tipoRescisao: e.target.value })}
        options={tiposRescisao}
        tooltip="Escolha o tipo de desligamento que ocorreu"
        required
      />

      <FormInput
        label="Salário Base (R$)"
        id="salarioBase"
        type="number"
        value={formData.salarioBase}
        onChange={(e) => updateFormData({ salarioBase: e.target.value })}
        step="0.01"
        min="0"
        tooltip="Seu salário fixo mensal, sem incluir horas extras ou adicionais"
        required
      />

      <FormInput
        label="Dias Trabalhados no Mês da Rescisão"
        id="diasTrabalhadosMes"
        type="number"
        value={formData.diasTrabalhadosMes}
        onChange={(e) => updateFormData({ diasTrabalhadosMes: e.target.value })}
        min="0"
        max="31"
        tooltip="Quantos dias você trabalhou no mês em que foi demitido"
        required
      />

      <button type="button" className="btn-next" onClick={nextStep}>
        Próximo
      </button>
    </section>
  );
}

