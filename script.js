// Constantes
const SALARIO_MINIMO = 1412.00; // Atualizar conforme ano
const JORNADA_MENSAL = 220; // 44h semanais

// Estado da aplicação
let currentStep = 1;
let calculoResultado = {};
let meses13AlteradoManualmente = false;

const DIA_EM_MS = 1000 * 60 * 60 * 24;
const formatterBRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

// Navegação entre etapas
function nextStep(step) {
    if (validateCurrentStep()) {
        document.querySelector(`#step${currentStep}`).classList.remove('active');
        currentStep = step;
        document.querySelector(`#step${step}`).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep(step) {
    document.querySelector(`#step${currentStep}`).classList.remove('active');
    currentStep = step;
    document.querySelector(`#step${step}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validação de etapas
function validateCurrentStep() {
    const currentSection = document.querySelector(`#step${currentStep}`);
    const requiredFields = currentSection.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value) {
            alert(`Por favor, preencha o campo: ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }
    return true;
}

// Toggle de seções condicionais
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const checkbox = event.target;
    
    if (checkbox.checked) {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
        // Limpar campos da seção
        const inputs = section.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }
}

// Toggle para valores recebidos
document.getElementById('informarValoresRecebidos')?.addEventListener('change', function() {
    toggleSection('valoresRecebidosSection');
});

function aplicarMascaraData(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')
        .substring(0, 10);
}

function parseDataBR(valor) {
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

function dataBRValida(valor) {
    const data = parseDataBR(valor);
    return data instanceof Date && !Number.isNaN(data.getTime());
}

function formatarMoeda(valor) {
    return formatterBRL.format(valor || 0);
}

// Função principal de cálculo
function calcularRescisao() {
    if (!validateCurrentStep()) return;
    
    // Coletar dados do formulário
    const dados = coletarDadosFormulario();

    if (!dados) {
        return;
    }
    
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
    
    // Armazenar resultados
    calculoResultado = {
        calculos,
        totalDevido,
        totalRecebido,
        diferenca,
        dados
    };
    
    // Exibir resultados
    exibirResultados();
    
    // Ir para etapa de resultados
    nextStep(5);
}

// Coletar dados do formulário
function coletarDadosFormulario() {
    const dataAdmissaoEl = document.getElementById('dataAdmissao');
    const dataRescisaoEl = document.getElementById('dataRescisao');

    const dataAdmissao = parseDataBR(dataAdmissaoEl?.value);
    const dataRescisao = parseDataBR(dataRescisaoEl?.value);

    if (!dataAdmissao || !dataRescisao) {
        alert('Informe datas válidas no formato dd/mm/aaaa.');
        return null;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataRescisao > hoje) {
        alert('A data de rescisão não pode ser no futuro.');
        return null;
    }

    if (dataRescisao < dataAdmissao) {
        alert('A data de rescisão deve ser posterior à data de admissão.');
        return null;
    }

    const mesesTrabalhados13InputEl = document.getElementById('mesesTrabalhados13');
    const mesesTrabalhados13Automatico = calcularMesesTrabalhados13(dataAdmissao, dataRescisao);

    let mesesTrabalhados13 = parseInt(mesesTrabalhados13InputEl?.value ?? '', 10);

    if (Number.isNaN(mesesTrabalhados13)) {
        if (typeof mesesTrabalhados13Automatico === 'number' && !Number.isNaN(mesesTrabalhados13Automatico)) {
            mesesTrabalhados13 = mesesTrabalhados13Automatico;
            if (mesesTrabalhados13InputEl) {
                mesesTrabalhados13InputEl.value = mesesTrabalhados13;
            }
        } else {
            mesesTrabalhados13 = 0;
        }
    }

    // Calcular tempo de serviço
    const diffTime = Math.abs(dataRescisao - dataAdmissao);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const anosCompletos = Math.floor(diffMonths / 12);
    
    const dados = {
        // Dados básicos
        dataAdmissao,
        dataRescisao,
        tipoRescisao: document.getElementById('tipoRescisao').value,
        salarioBase: parseFloat(document.getElementById('salarioBase').value),
        diasTrabalhadosMes: parseInt(document.getElementById('diasTrabalhadosMes').value),
        anosCompletos,
        mesesCompletos: diffMonths,
        
        // Adicionais
        temHorasExtras: document.getElementById('temHorasExtras').checked,
        mediaHorasExtras: parseFloat(document.getElementById('mediaHorasExtras')?.value || 0),
        percentualHE: parseFloat(document.getElementById('percentualHE')?.value || 50),
        
        temAdicionalNoturno: document.getElementById('temAdicionalNoturno').checked,
        mediaAdicionalNoturno: parseFloat(document.getElementById('mediaAdicionalNoturno')?.value || 0),
        
        temInsalubridade: document.getElementById('temInsalubridade').checked,
        grauInsalubridade: parseFloat(document.getElementById('grauInsalubridade')?.value || 0) / 100,
        baseInsalubridade: document.getElementById('baseInsalubridade')?.value,
        
        temPericulosidade: document.getElementById('temPericulosidade').checked,
        
        // Férias e 13º
        feriasVencidas: document.getElementById('feriasVencidas').value === 'sim',
        periodosFeriasVencidas: parseInt(document.getElementById('periodosFeriasVencidas')?.value || 0),
        feriasEmDobro: document.getElementById('feriasEmDobro')?.checked || false,
        mesesTrabalhadosProporcionais: parseInt(document.getElementById('mesesTrabalhadosProporcionais').value),
        mesesTrabalhados13,
        
        // FGTS
        saldoFGTS: parseFloat(document.getElementById('saldoFGTS').value),
        
        // Valores recebidos
        valoresRecebidos: {
            saldoSalario: parseFloat(document.getElementById('saldoSalarioRecebido')?.value || 0),
            avisoPrevio: parseFloat(document.getElementById('avisoPrevioRecebido')?.value || 0),
            decimoTerceiro: parseFloat(document.getElementById('decimoTerceiroRecebido')?.value || 0),
            ferias: parseFloat(document.getElementById('feriasRecebidas')?.value || 0),
            multaFGTS: parseFloat(document.getElementById('multaFGTSRecebida')?.value || 0)
        }
    };
    
    // Calcular salário base total (incluindo adicionais habituais)
    dados.salarioBaseTotal = calcularSalarioBaseTotal(dados);
    
    return dados;
}

// Calcular salário base total com adicionais
function calcularSalarioBaseTotal(dados) {
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

function calcularMesesTrabalhados13(dataAdmissao, dataRescisao) {
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

function atualizarMesesTrabalhados13() {
    const dataAdmissaoEl = document.getElementById('dataAdmissao');
    const dataRescisaoEl = document.getElementById('dataRescisao');
    const meses13Input = document.getElementById('mesesTrabalhados13');

    if (!dataAdmissaoEl || !dataRescisaoEl || !meses13Input) {
        return;
    }

    if (!dataAdmissaoEl.value || !dataRescisaoEl.value) {
        return;
    }

    if (!dataBRValida(dataAdmissaoEl.value) || !dataBRValida(dataRescisaoEl.value)) {
        return;
    }

    const mesesCalculados = calcularMesesTrabalhados13(
        parseDataBR(dataAdmissaoEl.value),
        parseDataBR(dataRescisaoEl.value)
    );

    if (typeof mesesCalculados === 'number' && !Number.isNaN(mesesCalculados)) {
        if (!meses13AlteradoManualmente || !meses13Input.value) {
            meses13Input.value = mesesCalculados;
        }

        meses13Input.dataset.autoValue = mesesCalculados;
    }
}

// Cálculo de Saldo de Salário
function calcularSaldoSalario(dados) {
    const valor = dados.salarioBaseTotal * (dados.diasTrabalhadosMes / 30);
    
    return {
        nome: 'Saldo de Salário',
        valor: valor,
        descricao: `Salário proporcional aos ${dados.diasTrabalhadosMes} dias trabalhados no mês da rescisão`,
        formula: `${formatarMoeda(dados.salarioBaseTotal)} × (${dados.diasTrabalhadosMes} ÷ 30) = ${formatarMoeda(valor)}`
    };
}

// Cálculo de Aviso Prévio
function calcularAvisoPrevio(dados) {
    // Aviso prévio só é devido em demissão sem justa causa
    if (dados.tipoRescisao !== 'sem_justa_causa' && dados.tipoRescisao !== 'acordo') {
        return {
            nome: 'Aviso Prévio Indenizado',
            valor: 0,
            descricao: 'Não aplicável para este tipo de rescisão',
            formula: 'N/A'
        };
    }
    
    // CORRIGIDO: 30 dias + 3 dias por ano (sem subtrair 1)
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
function calcularDecimoTerceiro(dados) {
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
    
    // CORRIGIDO: Considerar frações de 15 dias ou mais como mês completo
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
function calcularFerias(dados) {
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
function calcularFGTS(dados) {
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
function calcularTotalRecebido(dados) {
    const valores = dados.valoresRecebidos;
    return valores.saldoSalario + valores.avisoPrevio + valores.decimoTerceiro + 
           valores.ferias + valores.multaFGTS;
}

// Exibir resultados
function exibirResultados() {
    const container = document.getElementById('resultadoCalculos');
    const { calculos, totalDevido, totalRecebido, diferenca } = calculoResultado;
    
    let html = '<div class="resultado-detalhes"><h3>Discriminação dos Valores</h3>';
    
    // Exibir cada cálculo
    for (let key in calculos) {
        const calc = calculos[key];
        html += `
            <div class="resultado-item">
                <div>
                    <div class="resultado-label">${calc.nome}</div>
                    <div class="info-text" style="font-size: 0.85rem; margin-top: 5px;">
                        ${calc.descricao}
                    </div>
                </div>
                <div class="resultado-valor">${formatarMoeda(calc.valor)}</div>
            </div>
        `;
    }
    
    html += '</div>';
    
    // Total devido
    html += `
        <div class="resultado-item total">
            <div class="resultado-label">TOTAL QUE VOCÊ DEVERIA RECEBER</div>
            <div class="resultado-valor">${formatarMoeda(totalDevido)}</div>
        </div>
    `;
    
    // Total recebido
    if (totalRecebido > 0) {
        html += `
            <div class="resultado-item">
                <div class="resultado-label">Total Já Recebido</div>
                <div class="resultado-valor">${formatarMoeda(totalRecebido)}</div>
            </div>
        `;
    }
    
    // Diferença
    const diferencaClass = diferenca > 0 ? 'diferenca' : 'diferenca positiva';
    const diferencaTexto = diferenca > 0 
        ? 'DIFERENÇA A RECEBER' 
        : 'Você recebeu tudo corretamente!';
    
    html += `
        <div class="resultado-item ${diferencaClass}">
            <div class="resultado-label">${diferencaTexto}</div>
            <div class="resultado-valor">${formatarMoeda(Math.abs(diferenca))}</div>
        </div>
    `;
    
    // Mensagem adicional
    if (diferenca > 0) {
        html += `
            <div class="message error" style="margin-top: 20px;">
                <strong>⚠️ Atenção!</strong> Foi identificada uma diferença de <strong>${formatarMoeda(diferenca)}</strong> 
                que você tem direito a receber. Entre em contato com um advogado trabalhista para reivindicar seus direitos.
            </div>
        `;
    } else if (diferenca < 0) {
        html += `
            <div class="message success" style="margin-top: 20px;">
                <strong>✓ Parabéns!</strong> Seus cálculos indicam que você recebeu os valores corretamente. 
                Se tiver dúvidas, consulte um advogado trabalhista.
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Modal de Lead
function showLeadForm() {
    document.getElementById('leadModal').style.display = 'block';
}

function closeLeadForm() {
    document.getElementById('leadModal').style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('leadModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Submeter lead
async function submitLead(event) {
    event.preventDefault();
    
    const leadData = {
        nome: document.getElementById('leadNome').value,
        email: document.getElementById('leadEmail').value,
        telefone: document.getElementById('leadTelefone').value,
        cidade: document.getElementById('leadCidade').value,
        mensagem: document.getElementById('leadMensagem').value,
        diferencaCalculada: calculoResultado.diferenca,
        dataCalculo: new Date().toISOString(),
        tipoRescisao: calculoResultado.dados.tipoRescisao
    };
    
    try {
        // Enviar para API serverless do Vercel
        const response = await fetch('/api/submit-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });
        
        if (response.ok) {
            alert('✓ Solicitação enviada com sucesso! Entraremos em contato em breve.');
            closeLeadForm();
            document.getElementById('leadForm').reset();
        } else {
            throw new Error('Erro ao enviar solicitação');
        }
    } catch (error) {
        alert('❌ Erro ao enviar solicitação. Por favor, tente novamente.');
        console.error(error);
    }
}

// Reset do formulário
function resetForm() {
    document.getElementById('rescisaoForm').reset();
    currentStep = 1;
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    meses13AlteradoManualmente = false;
    atualizarMesesTrabalhados13();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const dataAdmissaoInput = document.getElementById('dataAdmissao');
    const dataRescisaoInput = document.getElementById('dataRescisao');
    const meses13Input = document.getElementById('mesesTrabalhados13');

    const inputsData = [dataAdmissaoInput, dataRescisaoInput].filter(Boolean);

    inputsData.forEach(input => {
        input.addEventListener('input', event => {
            const mascarado = aplicarMascaraData(event.target.value);
            event.target.value = mascarado;
        });

        input.addEventListener('blur', event => {
            const { value } = event.target;

            if (!value) {
                atualizarMesesTrabalhados13();
                return;
            }

            if (!dataBRValida(value)) {
                alert('Informe uma data válida no formato dd/mm/aaaa.');
                event.target.value = '';
                setTimeout(() => event.target.focus(), 0);
                return;
            }

            meses13AlteradoManualmente = false;
            atualizarMesesTrabalhados13();
        });
    });

    meses13Input?.addEventListener('input', () => {
        meses13AlteradoManualmente = true;
    });

    atualizarMesesTrabalhados13();

    console.log('Calculadora de Rescisão Trabalhista carregada!');
});
