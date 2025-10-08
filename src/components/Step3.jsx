import React, { useEffect } from 'react';
import { FormInput, FormSelect, FormCheckbox } from './FormInput';
import { parseDataBR } from '../utils/formatters';
import { calcularMesesTrabalhados13 } from '../utils/calculations';

export function Step3({ formData, updateFormData, prevStep, nextStep }) {
  // Auto-calcular meses trabalhados para 13º
  useEffect(() => {
    if (formData.dataAdmissao && formData.dataRescisao) {
      const dataAdm = parseDataBR(formData.dataAdmissao);
      const dataResc = parseDataBR(formData.dataRescisao);
      
      if (dataAdm && dataResc) {
        const meses = calcularMesesTrabalhados13(dataAdm, dataResc);
        if (meses !== null && !formData.meses13AlteradoManualmente) {
          updateFormData({ mesesTrabalhados13: meses });
        }
      }
    }
  }, [formData.dataAdmissao, formData.dataRescisao]);

  return (
    <section className="form-section active">
      <h2>Férias e 13º Salário</h2>

      <FormSelect
        label="Tem Férias Vencidas (não gozadas)?"
        id="feriasVencidas"
        value={formData.feriasVencidas ? 'sim' : 'nao'}
        onChange={(e) => updateFormData({ feriasVencidas: e.target.value === 'sim' })}
        options={[
          { value: 'nao', label: 'Não' },
          { value: 'sim', label: 'Sim' }
        ]}
        tooltip="Férias que você já tinha direito mas ainda não tirou"
      />

      {formData.feriasVencidas && (
        <div className="subsection">
          <FormInput
            label="Quantos Períodos de Férias Vencidas?"
            id="periodosFeriasVencidas"
            type="number"
            value={formData.periodosFeriasVencidas}
            onChange={(e) => updateFormData({ periodosFeriasVencidas: e.target.value })}
            min="0"
            max="2"
            tooltip="Cada período aquisitivo completo não gozado"
          />

          <FormCheckbox
            label="Férias em Dobro (venceu o prazo concessivo)"
            id="feriasEmDobro"
            checked={formData.feriasEmDobro}
            onChange={(e) => updateFormData({ feriasEmDobro: e.target.checked })}
            tooltip="Se a empresa não concedeu férias no prazo de 12 meses após o período aquisitivo, deve pagar em dobro"
          />
        </div>
      )}

      <FormInput
        label="Meses Trabalhados no Período Proporcional de Férias"
        id="mesesTrabalhadosProporcionais"
        type="number"
        value={formData.mesesTrabalhadosProporcionais}
        onChange={(e) => updateFormData({ mesesTrabalhadosProporcionais: e.target.value })}
        min="0"
        max="11"
        tooltip="Quantos meses completos você trabalhou desde a última aquisição de férias (considere 15+ dias como 1 mês)"
        required
      />

      <FormInput
        label="Meses Trabalhados no Ano para 13º Salário"
        id="mesesTrabalhados13"
        type="number"
        value={formData.mesesTrabalhados13}
        onChange={(e) => {
          updateFormData({ 
            mesesTrabalhados13: e.target.value,
            meses13AlteradoManualmente: true 
          });
        }}
        min="0"
        max="12"
        tooltip="Quantos meses completos você trabalhou neste ano (considere 15+ dias como 1 mês)"
        required
      />
      <p className="info-text">Calculado automaticamente a partir das datas informadas; confirme se está correto antes de prosseguir.</p>

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

