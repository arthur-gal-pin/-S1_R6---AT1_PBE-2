import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const imagemController = {

  buscarPorNome: (req: Request, res: Response): void => {
    try {
      const { nomeArquivo } = req.params;

      const caminhoCompleto = path.join(__dirname, '../../../uploads/produtos/imagens', String(nomeArquivo));


      return res.sendFile(caminhoCompleto, (error) => {
        if (error) {
          res.status(404).json({
            sucesso: false,
            mensagem: 'Imagem não encontrada no servidor.'
          });
          return;
        }
      });

    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno ao processar a imagem.',
        erro: error
      });
    }
  }
}

export default imagemController;