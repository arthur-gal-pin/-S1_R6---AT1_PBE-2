import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Garante que o dotenv seja carregado antes de qualquer verificação
dotenv.config();

// Verificação de variáveis de ambiente
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    console.error("Variáveis de ambiente encontradas:", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        db: process.env.DB_DATABASE
    });
    throw new Error("Faltando variáveis críticas no arquivo .env para o banco de dados.");
}

class Database {
    private static instance: Database | null = null;
    private pool!: mysql.Pool;

    private constructor() {
        // O construtor privado impede instanciamento externo (regra do Singleton)
    }

    private createPool() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                port: Number(process.env.DB_PORT) || 3306,
                waitForConnections: true,
                connectionLimit: 50,
                queueLimit: 0,
                timezone: 'Z',
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined 
            });
            console.log("✅ Pool de conexão MySQL criado com sucesso.");
        } catch (error) {
            console.error("❌ Erro ao criar o pool de conexão:", error);
            throw error;
        }
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
            Database.instance.createPool();
        }
        return Database.instance;
    }

    public getPool(): mysql.Pool {
        return this.pool;
    }
}

// Exportamos a conexão pronta para uso
export const connection = Database.getInstance().getPool();

export async function initializeDatabase() {
    console.log("Inicializando o banco de dados e tabelas...");
    try {
        const tempConnection = await mysql.createConnection({
            
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
            ssl: { rejectUnauthorized: false }
        });

        const dbName = process.env.DB_DATABASE || 'deploy';

        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConnection.query(`USE \`${dbName}\`;`);

        // 1. Categorias
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                IdCategoria INT AUTO_INCREMENT,
                NomeCategoria VARCHAR(50) NOT NULL,
                DescricaoCategoria VARCHAR(255),
                DataCad DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                DataMod DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (IdCategoria)
            );
        `);

        // 2. Produtos
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                IdProduto INT AUTO_INCREMENT,
                FK_IdCategoria INT NOT NULL,
                NomeProduto VARCHAR(50) NOT NULL,
                DescricaoProduto VARCHAR(255),
                PrecoProduto DECIMAL(10,2) NOT NULL,
                QuantidadeEstoque INT NOT NULL DEFAULT 0,
                VinculoImagem VARCHAR(255),
                DataCad DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                DataMod DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (IdProduto),
                CONSTRAINT FK_produtos_categorias FOREIGN KEY (FK_IdCategoria) REFERENCES categorias (IdCategoria)
            );
        `);

        // 3. Pedidos
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                IdPedido INT AUTO_INCREMENT,
                StatusPedido ENUM('Pendente', 'Pago', 'Processando', 'Enviado', 'Entregue', 'Cancelado') NOT NULL DEFAULT 'Pendente',
                ValorTotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                DataCad DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                DataMod DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (IdPedido)
            );
        `);

        // 4. Itens do Pedido
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS itens_pedido (
                IdItem_Pedido INT AUTO_INCREMENT,
                FK_IdPedido INT NOT NULL,
                FK_IdProduto INT NOT NULL,
                Quantidade INT NOT NULL,
                Valor DECIMAL(10,2) NOT NULL,
                DataCad DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                DataMod DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (IdItem_Pedido),
                CONSTRAINT FK_itens_pedido_pedidos FOREIGN KEY (FK_IdPedido) REFERENCES pedidos (IdPedido),
                CONSTRAINT FK_itens_pedido_produtos FOREIGN KEY (FK_IdProduto) REFERENCES produtos (IdProduto)
            ) ENGINE=InnoDB;
        `);

        await tempConnection.end();
        console.log("Banco de dados e tabelas verificados/criados com sucesso.");
    } catch (error) {
        console.error("Erro ao criar o banco ou as tabelas:", error);
        throw error;
    }
}