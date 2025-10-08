import React, { useState } from 'react';
import { FormInput } from './FormInput';

export function LeadModal({ isOpen, onClose, resultado }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const leadData = {
      ...formData,
      diferencaCalculada: resultado?.diferenca || 0,
      dataCalculo: new Date().toISOString(),
      tipoRescisao: resultado?.dados?.tipoRescisao || ''
    };

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      if (response.ok) {
        alert('✓ Solicitação enviada com sucesso! Entraremos em contato em breve.');
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cidade: '',
          mensagem: ''
        });
        onClose();
      } else {
        throw new Error('Erro ao enviar solicitação');
      }
    } catch (error) {
      alert('❌ Erro ao enviar solicitação. Por favor, tente novamente.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }} onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Conecte-se com um Advogado</h2>
        <p>Preencha seus dados e entraremos em contato em até 24 horas.</p>
        
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Nome Completo *"
            id="leadNome"
            value={formData.nome}
            onChange={(e) => updateField('nome', e.target.value)}
            required
          />

          <FormInput
            label="E-mail *"
            id="leadEmail"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />

          <FormInput
            label="Telefone/WhatsApp *"
            id="leadTelefone"
            type="tel"
            value={formData.telefone}
            onChange={(e) => updateField('telefone', e.target.value)}
            placeholder="(11) 91234-5678"
            pattern="[0-9 ()+-]{10,16}"
            inputMode="tel"
            required
          />

          <FormInput
            label="Cidade/Estado"
            id="leadCidade"
            value={formData.cidade}
            onChange={(e) => updateField('cidade', e.target.value)}
          />

          <div className="form-group">
            <label htmlFor="leadMensagem">Mensagem (opcional)</label>
            <textarea
              id="leadMensagem"
              rows="4"
              value={formData.mensagem}
              onChange={(e) => updateField('mensagem', e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit-lead" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      </div>
    </div>
  );
}

