import React from 'react';
import { formatarMoeda } from '../utils/formatters';

export function Step5({ resultado, onShowLeadForm, onReset }) {
  if (!resultado) return null;

  const { calculos, totalDevido, totalRecebido, diferenca } = resultado;

  return (
    <section className="form-section active">
      <h2>Resultado da Sua Rescisão</h2>
      
      <div id="resultadoCalculos" className="resultado-container">
        <div className="resultado-detalhes">
          <h3>Discriminação dos Valores</h3>

          {Object.values(calculos).map((calc, index) => (
            <div key={index} className="resultado-item">
              <div>
                <div className="resultado-label">{calc.nome}</div>
                <div className="info-text" style={{ fontSize: '0.85rem', marginTop: '5px' }}>
                  {calc.descricao}
                </div>
              </div>
              <div className="resultado-valor">{formatarMoeda(calc.valor)}</div>
            </div>
          ))}
        </div>

        <div className="resultado-item total">
          <div className="resultado-label">TOTAL QUE VOCÊ DEVERIA RECEBER</div>
          <div className="resultado-valor">{formatarMoeda(totalDevido)}</div>
        </div>

        {totalRecebido > 0 && (
          <div className="resultado-item">
            <div className="resultado-label">Total Já Recebido</div>
            <div className="resultado-valor">{formatarMoeda(totalRecebido)}</div>
          </div>
        )}

        <div className={`resultado-item ${diferenca > 0 ? 'diferenca' : 'diferenca positiva'}`}>
          <div className="resultado-label">
            {diferenca > 0 ? 'DIFERENÇA A RECEBER' : 'Você recebeu tudo corretamente!'}
          </div>
          <div className="resultado-valor">{formatarMoeda(Math.abs(diferenca))}</div>
        </div>

        {diferenca > 0 && (
          <div className="message error" style={{ marginTop: '20px' }}>
            <strong>⚠️ Atenção!</strong> Foi identificada uma diferença de <strong>{formatarMoeda(diferenca)}</strong> que você tem direito a receber. Entre em contato com um advogado trabalhista para reivindicar seus direitos.
          </div>
        )}

        {diferenca < 0 && (
          <div className="message success" style={{ marginTop: '20px' }}>
            <strong>✓ Parabéns!</strong> Seus cálculos indicam que você recebeu os valores corretamente. Se tiver dúvidas, consulte um advogado trabalhista.
          </div>
        )}
      </div>

      <div className="cta-section">
        <h3>Tem diferenças a receber?</h3>
        <p>Conecte-se com um advogado trabalhista especializado para garantir seus direitos.</p>
        
        <button type="button" className="btn-cta" onClick={onShowLeadForm}>
          Falar com um Advogado Agora
        </button>
      </div>

      <button type="button" className="btn-back" onClick={onReset}>
        Fazer Novo Cálculo
      </button>
    </section>
  );
}

