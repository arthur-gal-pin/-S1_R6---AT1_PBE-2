import { Request, Response } from 'express';
import { Pedidos } from '../models/Pedidos';
import { ItensPedido } from '../models/Itens_Pedido';
import { enumStatusPedido } from '../enum/statusPedido';
import { pedidoRepository } from '../repositories/pedido.repository';

export const pedidoController = {

    // 1. CRIAR PEDIDO
    criar: async (Req: Request, Res: Response) => {
        try {
            const { itens, status } = Req.body;

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return Res.status(400).json({ message: 'Um pedido precisa ter pelo menos um item.' });
            }

            const listaItens = itens.map(item => ItensPedido.criar({
                produtoId: item.idProduto,
                valor: item.valor,
                quantidade: item.quantidade
            }));

            const subTotalCalculado = ItensPedido.calcularSubTotal(listaItens);


            const novoPedido = new Pedidos(
                null,
                subTotalCalculado,
                status || enumStatusPedido.Pendente,
                new Date().toISOString(),
                new Date().toISOString()
            );

            const result = await pedidoRepository.create(novoPedido, listaItens);

            return Res.status(201).json({
                message: 'Pedido finalizado com sucesso!',
                pedidoId: result.pedidoId,
                total: result.subTotal,
                itensPedidoId: result.itensInseridos
            });

        } catch (error: any) {
            return Res.status(400).json({ message: error.message });
        }
    },

    // 2. ADICIONAR ITEM A UM PEDIDO EXISTENTE
    atualizarAddItem: async (Req: Request, Res: Response) => {
        try {
            const idPedido = Number(Req.params.idPedido);
            const { idProduto, quantidade, valor } = Req.body;

            const dadosAtuais = await pedidoRepository.read(idPedido);
            if (!dadosAtuais || dadosAtuais.length === 0) {
                return Res.status(404).json({ message: 'Pedido não encontrado.' });
            }

            const novoItem = ItensPedido.criar({
                id: null,
                pedidoId: idPedido,
                produtoId: idProduto,
                valor: valor,
                quantidade: quantidade,
            });


            const novoSubTotal = Number(dadosAtuais[0].ValorTotal) + (novoItem.valor * novoItem.quantidade);

            const pedidoAtualizado = new Pedidos(idPedido, novoSubTotal, dadosAtuais[0].Status, dadosAtuais[0].DataCad, new Date().toISOString());

            await pedidoRepository.updateAdicao(idPedido, pedidoAtualizado, novoItem);

            return Res.status(201).json({ message: 'Item adicionado e valor do pedido atualizado.' });

        } catch (error: any) {
            return Res.status(400).json({ message: error.message });
        }
    },

    // 3. REMOVER ITEM
    atualizarRemItem: async (Req: Request, Res: Response) => {
        try {
            const idPedido = Number(Req.params.idPedido);
            const idItem = Number(Req.params.idItem);

            const itemRemover = await pedidoRepository.findById(idItem);
            if (!itemRemover) {
                return Res.status(404).json({ message: 'Item não encontrado.' });
            }

            const pedidoDados = await pedidoRepository.read(idPedido);
            if (!pedidoDados || pedidoDados.length === 0) {
                return Res.status(404).json({ message: 'Pedido pai não encontrado.' });
            }

            const subTotalAntigo = Number(pedidoDados[0].ValorTotal);
            const valorSubtrair = itemRemover.valor * itemRemover.quantidade;

            let novoSubTotal = subTotalAntigo - valorSubtrair;
            novoSubTotal = Math.round(novoSubTotal * 100) / 100;

            if (novoSubTotal <= 0) {
                return Res.status(400).json({
                    message: 'Não é possível excluir o item, pois o pedido não pode ficar sem itens ou com valor zero.'
                });
            }

            const pedidoAtualizado = new Pedidos(
                idPedido,
                novoSubTotal,
                pedidoDados[0].StatusPedido,
                pedidoDados[0].DataCad,
                new Date().toISOString()
            );

            const sucesso = await pedidoRepository.updateRemocao(idItem, pedidoAtualizado);

            if (sucesso) {
                return Res.status(200).json({
                    message: 'Item removido com sucesso.',
                    novoTotal: novoSubTotal
                });
            } else {
                return Res.status(500).json({ message: 'Falha ao remover o item no banco de dados.' });
            }

        } catch (error: any) {
            console.error("Erro no Controller atualizarRemItem:", error);
            return Res.status(500).json({ message: 'Erro interno ao processar a remoção.' });
        }
    },

    // 4. ATUALIZAR STATUS
    atualizarStatus: async (Req: Request, Res: Response) => {
        try {
            const idPedido = Number(Req.params.id);
            const { status } = Req.body;

            await pedidoRepository.updateStatus(status as enumStatusPedido, idPedido);
            return Res.status(200).json({ message: 'Status atualizado.' });

        } catch (error: any) {
            return Res.status(400).json({ message: error.message });
        }
    },

    excluir: async (Req: Request, Res: Response) => {
        try {
            const id = Number(Req.params.id);

            if (isNaN(id)) {
                return Res.status(400).json({ message: 'ID inválido para exclusão.' });
            }

            const excluiu = await pedidoRepository.delete(id);

            if (!excluiu) {
                return Res.status(404).json({
                    message: 'Não foi possível excluir. Pedido não encontrado.'
                });
            }

            return Res.status(200).json({
                message: `Pedido ${id} e seus itens foram removidos com sucesso.`
            });

        } catch (error: any) {
            console.error("Erro ao deletar pedido:", error);
            return Res.status(500).json({
                message: 'Erro interno ao tentar excluir o pedido.',
                error: error.message
            });
        }
    },
    listar: async (Req: Request, Res: Response) => {
        try {
            const id = Number(Req.query.id);

            // Se o usuário passou um ID mas não é um número válido
            if (Req.params.id && isNaN(id) || id <= 0) {
                return Res.status(400).json({ message: 'O ID fornecido é inválido.' });
            }

            const resultados = await pedidoRepository.read(id);

            // Se buscou por um ID específico e não achou nada
            if (id && (!resultados || resultados.length === 0)) {
                return Res.status(404).json({ message: 'Pedido não encontrado.' });
            }

            return Res.status(200).json(resultados);

        } catch (error: any) {
            console.error("Erro ao ler pedidos:", error);
            return Res.status(500).json({
                message: 'Erro ao buscar dados no banco.',
                error: error.message
            });
        }
    },
};