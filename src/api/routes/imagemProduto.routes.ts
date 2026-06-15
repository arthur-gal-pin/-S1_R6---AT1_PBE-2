import { Router } from 'express';
import imagemController from '../controllers/imagemProduto.controller';

const imagemRoutes = Router();

imagemRoutes.get('/:nomeArquivo', imagemController.buscarPorNome);

export default imagemRoutes;