import React from 'react';
import { FormInput, FormSelect, FormCheckbox } from './FormInput';
import { GRAUS_INSALUBRIDADE, BASE_INSALUBRIDADE } from '../utils/constants';

export function Step2({ formData, updateFormData, prevStep, nextStep }) {
  return (
    <section className="form-section active">
      <h2>Adicionais e Horas Extras</h2>

      <FormCheckbox
        label="Recebia Horas Extras"
        id="temHorasExtras"
        checked={formData.temHorasExtras}
        onChange={(e) => updateFormData({ temHorasExtras: e.target.checked })}
        tooltip="Marque se você fazia horas extras habitualmente"
      />

      {formData.temHorasExtras && (
        <div className="subsection">
          <FormInput
            label="Média Mensal de Horas Extras (últimos 12 meses)"
            id="mediaHorasExtras"
            type="number"
            value={formData.mediaHorasExtras}
            onChange={(e) => updateFormData({ mediaHorasExtras: e.target.value })}
            step="0.01"
            min="0"
            tooltip="Some todas as horas extras dos últimos 12 meses e divida por 12"
          />

          <FormInput
            label="Percentual de Hora Extra (%)"
            id="percentualHE"
            type="number"
            value={formData.percentualHE}
            onChange={(e) => updateFormData({ percentualHE: e.target.value })}
            min="50"
            max="100"
            tooltip="Mínimo legal é 50%. Verifique seu contracheque"
          />
        </div>
      )}

      <FormCheckbox
        label="Recebia Adicional Noturno"
        id="temAdicionalNoturno"
        checked={formData.temAdicionalNoturno}
        onChange={(e) => updateFormData({ temAdicionalNoturno: e.target.checked })}
        tooltip="Trabalho entre 22h e 5h com adicional mínimo de 20%"
      />

      {formData.temAdicionalNoturno && (
        <div className="subsection">
          <FormInput
            label="Média Mensal de Adicional Noturno (R$)"
            id="mediaAdicionalNoturno"
            type="number"
            value={formData.mediaAdicionalNoturno}
            onChange={(e) => updateFormData({ mediaAdicionalNoturno: e.target.value })}
            step="0.01"
            min="0"
            tooltip="Valor médio mensal recebido de adicional noturno nos últimos 12 meses"
          />
        </div>
      )}

      <FormCheckbox
        label="Recebia Adicional de Insalubridade"
        id="temInsalubridade"
        checked={formData.temInsalubridade}
        onChange={(e) => updateFormData({ temInsalubridade: e.target.checked })}
        tooltip="Trabalho em condições insalubres (calor, ruído, agentes químicos, etc.)"
      />

      {formData.temInsalubridade && (
        <div className="subsection">
          <FormSelect
            label="Grau de Insalubridade"
            id="grauInsalubridade"
            value={formData.grauInsalubridade}
            onChange={(e) => updateFormData({ grauInsalubridade: e.target.value })}
            options={GRAUS_INSALUBRIDADE}
            tooltip="Verifique no seu contracheque ou laudo técnico"
          />

          <FormSelect
            label="Base de Cálculo da Insalubridade"
            id="baseInsalubridade"
            value={formData.baseInsalubridade}
            onChange={(e) => updateFormData({ baseInsalubridade: e.target.value })}
            options={BASE_INSALUBRIDADE}
            tooltip="Algumas empresas calculam sobre o salário-mínimo, outras sobre o salário-base"
          />
        </div>
      )}

      <FormCheckbox
        label="Recebia Adicional de Periculosidade"
        id="temPericulosidade"
        checked={formData.temPericulosidade}
        onChange={(e) => updateFormData({ temPericulosidade: e.target.checked })}
        tooltip="Trabalho com risco de vida (eletricidade, explosivos, inflamáveis, etc.)"
      />

      {formData.temPericulosidade && (
        <div className="subsection">
          <p className="info-text">O adicional de periculosidade é de 30% sobre o salário base.</p>
        </div>
      )}

      <div className="btn-group">
        <button type="button" className="btn-back" onClick={prevStep}>
          Voltar
        </button>
        <button type="button" className="btn-next" onClick={nextStep}>
          Próximo
        </button>
      </div>
    </section>
  );
}

