import { Request, Response } from "express";
import produtoRepository from "../repositories/produto.repository";
import Produto from "../models/Produtos";
import fs from "node:fs/promises"

const produtoController = {
    criar: async (Req: Request, Res: Response) => {
        try {

            const reqFile = Req.file as any;

            const { idCategoria, nomeProduto, descricaoProduto, precoProduto, quantidadeEstoque } = Req.body;

            if (!reqFile) {
                return Res.status(400).json({
                    message: 'Arquivo de imagem não enviado.'
                });
            }

            const caminhoImagem: string = `produtos/imagens/${reqFile.filename}`;

            const produto = Produto.criar({
                idCategoria: Number(idCategoria),
                nome: nomeProduto,
                descricaoProduto: String(descricaoProduto),
                preco: Number(precoProduto),
                quantidadeEstoque: Number(quantidadeEstoque),
                vinculoImagem: caminhoImagem,
            });

            const result = await produtoRepository.create(produto);

            return Res.status(201).json({
                message: 'Registro inserido com sucesso.',
                produto: result,
                file: {
                    filename: reqFile.filename,
                    size: reqFile.size,
                    mimetype: reqFile.mimetype,
                }
            });

        } catch (error: any) {
            return Res.status(400).json({ message: error.message });
        }
    },
    atualizar: async (Req: Request, Res: Response) => {
        try {

            const reqFile = Req.file as any;

            if (!reqFile) {
                return Res.status(400).json({
                    message: 'Arquivo de imagem não enviado.'
                });
            }

            const id = Number(Req.params.id);

            const { idCategoria, nomeProduto, descricaoProduto, precoProduto, quantidadeEstoque } = Req.body;

            const caminhoImagem: string = `src/uploads/images/${reqFile.filename}`;

            if (!id) {
                Res.status(400).json({ error: 'O ID do produto é obrigatório na URL.' });
                return;
            };

            const produtoAtualizado = Produto.editar(Number(id), {
                idCategoria: Number(idCategoria),
                nome: nomeProduto,
                descricaoProduto,
                preco: Number(precoProduto),
                quantidadeEstoque: Number(quantidadeEstoque),
                vinculoImagem: String(caminhoImagem)
            });

            const result = await produtoRepository.update(produtoAtualizado);

            if (result.affectedRows === 0) {
                Res.status(404).json({ error: 'Produto não encontrado.' });
                return;
            }

            Res.status(200).json({
                message: 'O produto foi atualizado com sucesso.', affectedRows: result.affectedRows
            });

        } catch (error: any) {
            return Res.status(400).json({ message: error.message });
        }
    },
    listar: async (req: Request, res: Response) => {
        try {
            const id = req.query.id;
            let idProduto: number | undefined;

            if (id) {
                idProduto = Number(id);
                if (isNaN(idProduto)) {
                    return res.status(400).json({ error: true, message: "ID inválido." });
                }
            }

            const produtos = await produtoRepository.read(idProduto);

            if (idProduto && produtos.length === 0) {
                return res.status(404).json({ error: true, message: "Produto não encontrado." });
            }

            if (!idProduto && produtos.length === 0) {
                return res.status(404).json({ message: "Não há nenhum produto registrado no banco de dados." });
            }

            return res.status(200).json(produtos);

        } catch (error: any) {
            console.error("Erro no ProdutoController.read:", error);
            return res.status(500).json({ error: true, message: "Erro ao buscar produtos." });
        }
    },
    excluir: async (Req: Request, Res: Response) => {
        try {

        const id: number = Number(Req.params.id);
        const produtos = await produtoRepository.read(id);
        
        if (!produtos || produtos.length === 0) {
            return Res.status(404).json({ message: 'O produto não foi encontrado no banco de dados.' });
        }

        const produto = produtos[0];

        await fs.unlink(`./uploads/${produto.vinculoImagem}`);
            const result = await produtoRepository.delete(id);

        if (result) {
            return Res.status(200).json({ message: 'O produto foi excluído com sucesso!', data: result });
        }



        } catch (error: any) {
            return Res.status(400).json({ message: error.message });
        }
    }
}

export default produtoController;