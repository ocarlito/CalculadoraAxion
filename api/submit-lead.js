// API Serverless para envio de leads
// Este arquivo deve estar em /api/submit-lead.js

export default async function handler(req, res) {
    // Permitir apenas POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const leadData = req.body;

        // Validação básica
        if (!leadData.nome || !leadData.email || !leadData.telefone) {
            return res.status(400).json({ error: 'Dados obrigatórios faltando' });
        }

        // OPÇÃO 1: Salvar no banco de dados (exemplo com SQLite)
        // Você precisará configurar o banco de dados
        // const db = await connectDatabase();
        // await db.run(`
        //     INSERT INTO leads (nome, email, telefone, cidade, mensagem, diferenca, data_calculo, tipo_rescisao)
        //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        // `, [leadData.nome, leadData.email, leadData.telefone, leadData.cidade, leadData.mensagem, 
        //     leadData.diferencaCalculada, leadData.dataCalculo, leadData.tipoRescisao]);

        // OPÇÃO 2: Enviar por e-mail (usando serviço como SendGrid, Mailgun, etc.)
        // await sendEmail({
        //     to: 'seuemail@exemplo.com',
        //     subject: `Novo Lead: ${leadData.nome}`,
        //     body: `
        //         Nome: ${leadData.nome}
        //         Email: ${leadData.email}
        //         Telefone: ${leadData.telefone}
        //         Cidade: ${leadData.cidade}
        //         Diferença Calculada: R$ ${leadData.diferencaCalculada?.toFixed(2)}
        //         Tipo de Rescisão: ${leadData.tipoRescisao}
        //         Mensagem: ${leadData.mensagem}
        //     `
        // });

        // OPÇÃO 3: Integrar com CRM (RD Station, HubSpot, etc.)
        // await sendToCRM(leadData);

        // Por enquanto, vamos apenas logar (em produção, implemente uma das opções acima)
        console.log('Novo lead recebido:', leadData);

        return res.status(200).json({ 
            success: true, 
            message: 'Lead recebido com sucesso' 
        });

    } catch (error) {
        console.error('Erro ao processar lead:', error);
        return res.status(500).json({ 
            error: 'Erro interno do servidor' 
        });
    }
}