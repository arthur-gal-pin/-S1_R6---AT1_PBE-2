import Router from 'express';
import categoriaController from '../controllers/categoria.controller';
const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar);
categoriaRoutes.get('/', categoriaController.listar);
categoriaRoutes.put('/', categoriaController.atualizar);
categoriaRoutes.delete('/:id', categoriaController.excluir);

export default categoriaRoutes;