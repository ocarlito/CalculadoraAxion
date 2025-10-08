# Notas de Migração - Vanilla JS → React

## 📝 Resumo da Migração

Este documento descreve a migração completa do projeto de JavaScript vanilla para React.

## ✅ O que foi feito

### 1. Configuração do Ambiente
- ✅ React 19 + Vite instalado
- ✅ Estrutura de pastas criada (`src/`, `components/`, `utils/`, `hooks/`)
- ✅ Configuração Vite (`vite.config.js`)
- ✅ `.gitignore` atualizado

### 2. Utilitários Migrados

#### `src/utils/constants.js`
- Constantes globais (salário mínimo, jornada, etc.)
- Opções de select (tipos de rescisão, insalubridade, etc.)

#### `src/utils/formatters.js`
- Formatação de moeda (BRL)
- Máscara de data (dd/mm/aaaa)
- Parser de data brasileira
- Validação de datas

#### `src/utils/calculations.js`
- Todas as funções de cálculo migradas:
  - `calcularSalarioBaseTotal()`
  - `calcularSaldoSalario()`
  - `calcularAvisoPrevio()`
  - `calcularDecimoTerceiro()`
  - `calcularFerias()`
  - `calcularFGTS()`
  - `calcularMesesTrabalhados13()`
  - `calcularRescisao()` (função principal)

### 3. Componentes Criados

#### `src/components/FormInput.jsx`
- Componentes reutilizáveis:
  - `FormInput` - Input genérico com label e tooltip
  - `FormSelect` - Select com opções
  - `FormCheckbox` - Checkbox com label

#### `src/components/Step1.jsx`
- Dados básicos do contrato
- Máscara automática de datas
- Validação de campos obrigatórios

#### `src/components/Step2.jsx`
- Adicionais e horas extras
- Seções condicionais (mostrar/ocultar com base em checkboxes)
- Todos os adicionais: HE, noturno, insalubridade, periculosidade

#### `src/components/Step3.jsx`
- Férias e 13º salário
- Cálculo automático de meses trabalhados
- Opção de edição manual

#### `src/components/Step4.jsx`
- FGTS e valores já recebidos
- Seção condicional de valores recebidos
- Botão de cálculo

#### `src/components/Step5.jsx`
- Exibição de resultados detalhados
- Discriminação de cada verba
- Total devido vs total recebido
- Diferença a receber
- CTA para contato com advogado

#### `src/components/LeadModal.jsx`
- Modal de captura de leads
- Integração com API `/api/submit-lead`
- Validação de formulário
- Estados de loading

### 4. App Principal

#### `src/App.jsx`
- Gerenciamento de estado completo com `useState`
- Navegação entre steps
- Validação de etapas
- Controle de modal de leads
- Reset de formulário

#### `src/main.jsx`
- Ponto de entrada React
- Renderização do App

## 🔄 Mudanças Principais

### De Vanilla JS para React

| Vanilla JS | React |
|------------|-------|
| `document.getElementById()` | `useState()` + controlled inputs |
| Event listeners globais | Props e callbacks |
| Manipulação direta do DOM | Virtual DOM |
| `innerHTML` | JSX components |
| State global em variáveis | `useState` hook |
| `style.display = 'none'` | Conditional rendering `{condition && <Component />}` |

### Melhorias Implementadas

1. **Componentização**: Código modular e reutilizável
2. **Type Safety**: Melhor organização dos dados
3. **Reatividade**: Atualizações automáticas da UI
4. **Manutenibilidade**: Código mais limpo e organizado
5. **Performance**: Virtual DOM do React
6. **Developer Experience**: Hot Module Replacement (HMR)

## 📂 Arquivos Antigos

Os arquivos originais foram preservados:
- `index.html.backup` - HTML original
- `script.js` - Lógica JavaScript original (mantido como referência)
- `style.css` - Estilos mantidos (reutilizados)

## 🚀 Como Testar

1. Certifique-se de que o servidor está rodando: `npm run dev`
2. Acesse `http://localhost:3000`
3. Teste cada etapa do formulário:
   - Etapa 1: Preencha dados básicos
   - Etapa 2: Teste adicionais (marque/desmarque checkboxes)
   - Etapa 3: Verifique auto-cálculo de meses
   - Etapa 4: Teste valores recebidos
   - Etapa 5: Veja resultados e teste modal de leads

## 🐛 Debugging

Se encontrar erros:
1. Verifique console do navegador (F12)
2. Verifique terminal do Vite
3. Verifique se todas as props estão sendo passadas corretamente
4. Verifique tipos de dados (string vs number)

## 📊 Métricas

- **Linhas de código HTML**: ~356 → Componentizado em 6 arquivos JSX
- **Linhas de código JS**: ~706 → Separado em 3 utilitários + 6 componentes
- **Total de componentes**: 7 (6 steps + modal)
- **Total de utilitários**: 3 (constants, formatters, calculations)

## 🎯 Próximos Passos (Opcional)

1. **TypeScript**: Adicionar tipagem estática
2. **Testes**: Jest + React Testing Library
3. **Estado Global**: Context API ou Zustand
4. **Formulários**: React Hook Form para validação avançada
5. **shadcn/ui**: Substituir inputs customizados por componentes shadcn
6. **Animações**: Framer Motion para transições
7. **Persistência**: LocalStorage para salvar progresso
8. **PWA**: Tornar a aplicação instalável

## ✨ Conclusão

A migração foi concluída com sucesso! Toda a funcionalidade original foi preservada e melhorada com os benefícios do React.

