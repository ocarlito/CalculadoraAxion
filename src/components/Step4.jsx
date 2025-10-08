import React from 'react';
import { FormInput, FormCheckbox } from './FormInput';

export function Step4({ formData, updateFormData, prevStep, onCalculate }) {
  return (
    <section className="form-section active">
      <h2>FGTS e Valores Já Recebidos</h2>

      <FormInput
        label="Saldo Total do FGTS (R$)"
        id="saldoFGTS"
        type="number"
        value={formData.saldoFGTS}
        onChange={(e) => updateFormData({ saldoFGTS: e.target.value })}
        step="0.01"
        min="0"
        tooltip="Consulte o saldo em fgts.caixa.gov.br ou no app FGTS"
        required
      />

      <FormCheckbox
        label="Já recebi algum valor na rescisão"
        id="informarValoresRecebidos"
        checked={formData.informarValoresRecebidos}
        onChange={(e) => updateFormData({ informarValoresRecebidos: e.target.checked })}
        tooltip="Marque se você já recebeu alguma verba rescisória"
      />

      {formData.informarValoresRecebidos && (
        <div className="subsection">
          <p className="info-text">Informe os valores que você já recebeu (deixe em branco ou 0 o que não recebeu):</p>

          <FormInput
            label="Saldo de Salário Recebido (R$)"
            id="saldoSalarioRecebido"
            type="number"
            value={formData.valoresRecebidos.saldoSalario}
            onChange={(e) => updateFormData({ 
              valoresRecebidos: { 
                ...formData.valoresRecebidos, 
                saldoSalario: parseFloat(e.target.value) || 0 
              }
            })}
            step="0.01"
            min="0"
          />

          <FormInput
            label="Aviso Prévio Recebido (R$)"
            id="avisoPrevioRecebido"
            type="number"
            value={formData.valoresRecebidos.avisoPrevio}
            onChange={(e) => updateFormData({ 
              valoresRecebidos: { 
                ...formData.valoresRecebidos, 
                avisoPrevio: parseFloat(e.target.value) || 0 
              }
            })}
            step="0.01"
            min="0"
          />

          <FormInput
            label="13º Salário Recebido (R$)"
            id="decimoTerceiroRecebido"
            type="number"
            value={formData.valoresRecebidos.decimoTerceiro}
            onChange={(e) => updateFormData({ 
              valoresRecebidos: { 
                ...formData.valoresRecebidos, 
                decimoTerceiro: parseFloat(e.target.value) || 0 
              }
            })}
            step="0.01"
            min="0"
          />

          <FormInput
            label="Férias Recebidas (R$)"
            id="feriasRecebidas"
            type="number"
            value={formData.valoresRecebidos.ferias}
            onChange={(e) => updateFormData({ 
              valoresRecebidos: { 
                ...formData.valoresRecebidos, 
                ferias: parseFloat(e.target.value) || 0 
              }
            })}
            step="0.01"
            min="0"
          />

          <FormInput
            label="Multa FGTS (40%) Recebida (R$)"
            id="multaFGTSRecebida"
            type="number"
            value={formData.valoresRecebidos.multaFGTS}
            onChange={(e) => updateFormData({ 
              valoresRecebidos: { 
                ...formData.valoresRecebidos, 
                multaFGTS: parseFloat(e.target.value) || 0 
              }
            })}
            step="0.01"
            min="0"
          />
        </div>
      )}

      <div className="btn-group">
        <button type="button" className="btn-back" onClick={prevStep}>
          Voltar
        </button>
        <button type="button" className="btn-calculate" onClick={onCalculate}>
          Calcular Minha Rescisão
        </button>
      </div>
    </section>
  );
}

