# Calculadora de Rescisão Trabalhista

Uma calculadora completa de rescisão trabalhista desenvolvida em React, que ajuda trabalhadores a calcular seus direitos trabalhistas e conectá-los com advogados especializados.

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS via CDN
- **Vercel** - Hospedagem e serverless functions

## 📋 Funcionalidades

- ✅ Cálculo completo de rescisão trabalhista
- ✅ Suporte a todos os tipos de rescisão (sem justa causa, pedido de demissão, acordo, etc.)
- ✅ Cálculo de horas extras, adicionais noturnos, insalubridade e periculosidade
- ✅ Cálculo de férias vencidas, férias proporcionais e 13º salário
- ✅ Cálculo de multa do FGTS
- ✅ Comparação entre valores devidos e recebidos
- ✅ Formulário multi-step intuitivo
- ✅ Integração com API para captura de leads
- ✅ Responsivo e moderno

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/ocarlito/CalculadoraAxion.git

# Entrar no diretório
cd CalculadoraAxiom

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
CalculadoraAxiom/
├── src/
│   ├── components/         # Componentes React
│   │   ├── FormInput.jsx   # Inputs reutilizáveis
│   │   ├── Step1.jsx       # Dados básicos
│   │   ├── Step2.jsx       # Adicionais e horas extras
│   │   ├── Step3.jsx       # Férias e 13º
│   │   ├── Step4.jsx       # FGTS e valores recebidos
│   │   ├── Step5.jsx       # Resultados
│   │   └── LeadModal.jsx   # Modal de contato
│   ├── utils/              # Utilitários
│   │   ├── calculations.js # Lógica de cálculos
│   │   ├── constants.js    # Constantes
│   │   └── formatters.js   # Formatadores
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Ponto de entrada
├── api/
│   └── submit-lead.js      # API serverless Vercel
├── style.css               # Estilos globais
├── index.html              # HTML raiz
└── vite.config.js          # Configuração Vite
```

## 🎯 Como Usar

1. **Passo 1**: Informe os dados básicos do contrato (datas, tipo de rescisão, salário)
2. **Passo 2**: Adicione informações sobre adicionais (horas extras, noturno, insalubridade, periculosidade)
3. **Passo 3**: Informe dados sobre férias e 13º salário
4. **Passo 4**: Informe o saldo do FGTS e valores já recebidos (opcional)
5. **Passo 5**: Visualize os resultados detalhados e conecte-se com um advogado

## 📊 Cálculos Incluídos

- Saldo de salário
- Aviso prévio indenizado (com progressividade)
- 13º salário proporcional
- Férias vencidas e proporcionais (+ 1/3)
- Multa do FGTS (40%, 20% ou 0% conforme o caso)
- Integração de adicionais habituais (HE, noturno, insalubridade, periculosidade)

## 🔗 Deploy

O projeto está configurado para deploy automático na Vercel:

```bash
npm run deploy
```

## 👨‍💼 Autor

**Carlos Alberto Kümpel Imbriani**  
Advogado inscrito na OAB/SP

## 📝 Licença

MIT License - Todos os direitos reservados © 2025

## ⚠️ Disclaimer

Esta calculadora fornece estimativas baseadas na legislação trabalhista brasileira. Consulte um advogado para análise precisa do seu caso específico.

