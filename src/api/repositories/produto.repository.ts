import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { connection } from '../configs/Database';
import Produto from '../models/Produtos';

const produtoRepository = {
    create: async (produto: Produto): Promise<ResultSetHeader> => {
        const sql = 'INSERT INTO produtos (FK_IdCategoria, NomeProduto, DescricaoProduto, PrecoProduto, QuantidadeEstoque, VinculoImagem) VALUES (?,?,?,?,?,?)';
        const values = [produto.idCategoria, produto.nomeProduto, produto.descricaoProduto, produto.precoProduto, produto.quantidadeEstoque, produto.vinculoImagem];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },
    read: async (idProduto?: number): Promise<Produto[]> => {
        let sql = `SELECT * FROM produtos WHERE 1=1`;
        const params: any[] = [];

        if (idProduto !== undefined) {
            sql += ' AND idProduto = ?';
            params.push(idProduto);
        }

        const [rows] = await connection.execute<RowDataPacket[]>(sql, params);
        const result: Produto[] = rows.map(element =>
            new Produto(
            element.IdProduto,
            element.FK_IdCategoria,
            element.NomeProduto,
            element.DescricaoProduto,
            element.PrecoProduto,
            element.QuantidadeEstoque,
            element.VinculoImagem,
            element.dataCad,
            element.dataMod
            )
        );

        return result;
    },
    update: async (produto: Produto): Promise<ResultSetHeader> => {
        const sql = `UPDATE produtos SET NomeProduto=?, DescricaoProduto=?, PrecoProduto=?, QuantidadeEstoque=?, VinculoImagem=?, FK_IdCategoria=? WHERE IdProduto=?`;
        const values = [produto.nomeProduto, produto.descricaoProduto, produto.precoProduto, produto.quantidadeEstoque, produto.vinculoImagem, produto.idCategoria,produto.idProduto];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },
    delete: async (id: number): Promise<boolean> => {
        const sql = 'DELETE FROM produtos WHERE IdProduto = ?';
        const [result] = await connection.execute<ResultSetHeader>(sql, [id]);
        return result.affectedRows > 0;
    }
}
export default produtoRepository