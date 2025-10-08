-- Schema para banco de dados SQLite
-- Execute este script para criar as tabelas necessárias

CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cidade TEXT,
    mensagem TEXT,
    diferenca REAL,
    data_calculo TEXT,
    tipo_rescisao TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON leads(email);
CREATE INDEX idx_created_at ON leads(created_at);

-- Tabela para armazenar cálculos completos (opcional)
CREATE TABLE IF NOT EXISTS calculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    dados_json TEXT, -- JSON com todos os dados do cálculo
    resultado_json TEXT, -- JSON com os resultados
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
);