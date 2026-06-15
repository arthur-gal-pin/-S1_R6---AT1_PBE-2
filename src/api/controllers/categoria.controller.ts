import { Categoria } from "../models/Categorias";
import categoriaRepository from "../repositories/categoria.repository";
import { Request, Response } from "express";

const categoriaController = {
    criar: async (Req: Request, Res: Response) => {
        try {
            const { nome, descricao } = Req.body;
            if (!nome || !descricao || nome.lenght <= 3 || descricao.lenght <= 5) {
                return Res.status(400).json({ message: 'Digite corretamente os dados necessários' })
            }
            const categoria = Categoria.criar({ nome, descricao });
            const result = await categoriaRepository.create(categoria);
            return Res.status(201).json({ message: 'Categoria incluída com sucesso', result })
        } catch (error: any) {
            console.error(error);
            Res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        };
    },
    atualizar: async (Req: Request, Res: Response) => {
        try {
            const id: number = Number(Req.query.id);
            const { nome, descricao } = Req.body;
            if (!nome || !descricao || nome.lenght <= 3 || descricao.lenght <= 5 || isNaN(id) || id <= 0) {
                return Res.status(400).json({ message: 'Digite corretamente os dados necessários' })
            }
            const categoria = Categoria.editar(id, { nome, descricao });
            const result = await categoriaRepository.update(categoria);
            return Res.status(201).json({ message: 'Categoria atualizada com sucesso', result })

        } catch (error: any) {
            console.error(error);
            Res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    },
    listar: async (req: Request, res: Response) => {
        try {
            const queryId = req.query.id;

            let idCategoria: number | undefined;

            if (queryId) {
                idCategoria = Number(queryId);

                if (isNaN(idCategoria)) {
                    return res.status(400).json({
                        error: true,
                        message: "O ID fornecido deve ser um número válido."
                    });
                }
            }

            const categorias = await categoriaRepository.read(idCategoria);

            if (!idCategoria && categorias.length === 0){
                return res.status(404).json({
                    message: "Não há nenhuma categoria registrada no banco de dados."
                })
            }

            if (idCategoria && categorias.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: "Categoria não encontrada."
                });
            }

            return res.status(200).json(categorias);

        } catch (error: any) {
            console.error("Erro na CategoriaController.read:", error);
            return res.status(500).json({
                error: true,
                message: "Erro interno ao processar a requisição."
            });
        }
    },
    excluir: async (Req: Request, Res: Response) => {
        try {
            const id: number = Number(Req.params.id);
            if (isNaN(id) || id <= 0) {
                return Res.status(400).json({ message: 'Digite corretamente o ID necessário' })
            }
            const result = await categoriaRepository.delete(id);
            return Res.status(201).json({ message: 'Categoria deletada com sucesso', result })
        } catch (error: any) {
            console.error(error);
            Res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    }
}

export default categoriaController;