import { Router } from "express";
import produtoController from "../controllers/produto.controller";
import uploadImage from "../middlewares/uploadImagem.multer";
const produtoRoutes = Router();

produtoRoutes.post('/', uploadImage.single(`image`), produtoController.criar);
produtoRoutes.get('/', produtoController.listar);
produtoRoutes.put('/:id', uploadImage.single(`image`),produtoController.atualizar);
produtoRoutes.delete('/:id', produtoController.excluir);

export default produtoRoutes;