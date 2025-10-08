import React, { useState } from 'react';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { Step4 } from './components/Step4';
import { Step5 } from './components/Step5';
import { LeadModal } from './components/LeadModal';
import { calcularRescisao } from './utils/calculations';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [resultado, setResultado] = useState(null);
  
  const [formData, setFormData] = useState({
    // Step 1
    dataAdmissao: '',
    dataRescisao: '',
    tipoRescisao: '',
    salarioBase: '',
    diasTrabalhadosMes: '',
    
    // Step 2
    temHorasExtras: false,
    mediaHorasExtras: 0,
    percentualHE: 50,
    temAdicionalNoturno: false,
    mediaAdicionalNoturno: 0,
    temInsalubridade: false,
    grauInsalubridade: '10',
    baseInsalubridade: 'salario_minimo',
    temPericulosidade: false,
    
    // Step 3
    feriasVencidas: false,
    periodosFeriasVencidas: 0,
    feriasEmDobro: false,
    mesesTrabalhadosProporcionais: '',
    mesesTrabalhados13: '',
    meses13AlteradoManualmente: false,
    
    // Step 4
    saldoFGTS: '',
    informarValoresRecebidos: false,
    valoresRecebidos: {
      saldoSalario: 0,
      avisoPrevio: 0,
      decimoTerceiro: 0,
      ferias: 0,
      multaFGTS: 0
    }
  });

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.dataAdmissao || !formData.dataRescisao || !formData.tipoRescisao || 
            !formData.salarioBase || !formData.diasTrabalhadosMes) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return false;
        }
        break;
      case 3:
        if (!formData.mesesTrabalhadosProporcionais || !formData.mesesTrabalhados13) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return false;
        }
        break;
      case 4:
        if (!formData.saldoFGTS) {
          alert('Por favor, informe o saldo do FGTS.');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculate = () => {
    if (!validateStep(currentStep)) return;

    try {
      // Preparar dados para cálculo
      const dadosCalculo = {
        ...formData,
        salarioBase: parseFloat(formData.salarioBase),
        diasTrabalhadosMes: parseInt(formData.diasTrabalhadosMes),
        mediaHorasExtras: parseFloat(formData.mediaHorasExtras) || 0,
        percentualHE: parseFloat(formData.percentualHE) || 50,
        mediaAdicionalNoturno: parseFloat(formData.mediaAdicionalNoturno) || 0,
        grauInsalubridade: parseFloat(formData.grauInsalubridade) / 100 || 0,
        periodosFeriasVencidas: parseInt(formData.periodosFeriasVencidas) || 0,
        mesesTrabalhadosProporcionais: parseInt(formData.mesesTrabalhadosProporcionais),
        mesesTrabalhados13: parseInt(formData.mesesTrabalhados13),
        saldoFGTS: parseFloat(formData.saldoFGTS)
      };

      const result = calcularRescisao(dadosCalculo);
      setResultado(result);
      setCurrentStep(5);
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      dataAdmissao: '',
      dataRescisao: '',
      tipoRescisao: '',
      salarioBase: '',
      diasTrabalhadosMes: '',
      temHorasExtras: false,
      mediaHorasExtras: 0,
      percentualHE: 50,
      temAdicionalNoturno: false,
      mediaAdicionalNoturno: 0,
      temInsalubridade: false,
      grauInsalubridade: '10',
      baseInsalubridade: 'salario_minimo',
      temPericulosidade: false,
      feriasVencidas: false,
      periodosFeriasVencidas: 0,
      feriasEmDobro: false,
      mesesTrabalhadosProporcionais: '',
      mesesTrabalhados13: '',
      meses13AlteradoManualmente: false,
      saldoFGTS: '',
      informarValoresRecebidos: false,
      valoresRecebidos: {
        saldoSalario: 0,
        avisoPrevio: 0,
        decimoTerceiro: 0,
        ferias: 0,
        multaFGTS: 0
      }
    });
    setResultado(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <header>
        <h1>Calculadora de Rescisão Trabalhista</h1>
        <p className="subtitle">Descubra seus direitos e conecte-se com advogados especializados</p>
      </header>

      <main>
        <form id="rescisaoForm">
          {currentStep === 1 && (
            <Step1 
              formData={formData} 
              updateFormData={updateFormData} 
              nextStep={nextStep} 
            />
          )}
          
          {currentStep === 2 && (
            <Step2 
              formData={formData} 
              updateFormData={updateFormData} 
              prevStep={prevStep}
              nextStep={nextStep} 
            />
          )}
          
          {currentStep === 3 && (
            <Step3 
              formData={formData} 
              updateFormData={updateFormData} 
              prevStep={prevStep}
              nextStep={nextStep} 
            />
          )}
          
          {currentStep === 4 && (
            <Step4 
              formData={formData} 
              updateFormData={updateFormData} 
              prevStep={prevStep}
              onCalculate={handleCalculate} 
            />
          )}
          
          {currentStep === 5 && (
            <Step5 
              resultado={resultado}
              onShowLeadForm={() => setShowLeadModal(true)}
              onReset={resetForm}
            />
          )}
        </form>

        <LeadModal 
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          resultado={resultado}
        />
      </main>

      <footer>
        <p>&copy; 2025 Desenvolvido e Mantido por Carlos Alberto Kümpel Imbriani, advogado inscrito na OAB/SP. <br /><br /> Todos os direitos reservados.</p>
        <p className="disclaimer">Esta calculadora fornece estimativas baseadas na legislação trabalhista brasileira. Consulte um advogado para análise precisa do seu caso.</p>
      </footer>
    </div>
  );
}

export default App;
