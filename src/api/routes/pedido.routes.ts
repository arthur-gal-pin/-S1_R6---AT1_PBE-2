import Router from 'express';
import { pedidoController } from '../controllers/pedido.controller';
const pedidoRoutes = Router();

pedidoRoutes.post('/', pedidoController.criar);
pedidoRoutes.get('/', pedidoController.listar);
pedidoRoutes.put('/remocao/:idPedido/:idItem', pedidoController.atualizarRemItem);
pedidoRoutes.put('/adicao/:idPedido', pedidoController.atualizarAddItem);
pedidoRoutes.put('/status/:id', pedidoController.atualizarStatus)
pedidoRoutes.delete('/:id', pedidoController.excluir);

export default pedidoRoutes;