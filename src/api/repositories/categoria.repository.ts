import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Categoria } from '../models/Categorias';
import { connection } from '../configs/Database';

const categoriaRepository = {
    create: async (categoria: Categoria): Promise<ResultSetHeader> => {
        const sql = 'INSERT INTO categorias (NomeCategoria, DescricaoCategoria) VALUES (?,?)';
        const values = [categoria.nomeCategoria, categoria.descricao];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },
    read: async (idCategoria?: number): Promise<Categoria[]> => {
        let sql = `SELECT * FROM categorias WHERE 1=1`;
        const params: any[] = [];

        if (idCategoria !== undefined) {
            sql += ' AND IdCategoria = ?';
            params.push(idCategoria);
        }

        const [rows] = await connection.execute<RowDataPacket[]>(sql, params);
        const result: Categoria[] = rows.map(element =>
            new Categoria(
                element.IdCategoria,
                element.NomeCategoria,
                element.DescricaoCategoria,
                element.dataCad,
                element.dataMod
            )
        );

        return result;
    },
    update: async (categoria: Categoria): Promise<ResultSetHeader> => {
        const sql = 'UPDATE categorias SET NomeCategoria=?, DescricaoCategoria=? WHERE IdCategoria=?';
        const values = [categoria.nomeCategoria, categoria.descricao, categoria.idCategoria];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },
    delete: async (id: number): Promise<boolean> => {
        const sql = 'DELETE FROM categorias WHERE idCategoria = ?';
        const [result] = await connection.execute<ResultSetHeader>(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default categoriaRepository;