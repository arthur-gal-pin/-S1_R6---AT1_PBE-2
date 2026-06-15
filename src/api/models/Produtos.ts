export default class Produto {
    private _idProduto: number | null;
    private _idCategoria: number;
    private _nomeProduto: string;
    private _descricaoProduto: string;
    private _precoProduto: number;
    private _quantidadeEstoque: number;
    private _vinculoImagem: string = '';
    private _dataCad: string;
    private _dataMod: string;


    constructor(
        idProduto: number | null = null, 
        idCategoria: number = 0, 
        nomeProduto: string = '', 
        descricaoProduto: string = '', 
        precoProduto: number = 0, 
        quantidadeEstoque: number = 0, 
        vinculoImagem: string = '', 
        dataCad: string, 
        dataMod: string) {

        if(idProduto !== null) this.validarId(idProduto);
        if (idCategoria > 0) this.validarId(idCategoria);
        this.validarNome(nomeProduto);
        this.validarDescricaoProduto(descricaoProduto);
        this.validarPreco(precoProduto);
        this.validarQuantidadeEstoque(quantidadeEstoque);
        this.validarPathImagem(vinculoImagem);

        this._idProduto = idProduto;
        this._idCategoria = idCategoria;
        this._nomeProduto = nomeProduto;
        this._descricaoProduto = descricaoProduto;
        this._precoProduto = precoProduto;
        this._quantidadeEstoque = quantidadeEstoque
        this._vinculoImagem = vinculoImagem;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idProduto(): number | null { return this._idProduto };
    get idCategoria(): number { return this._idCategoria };
    get nomeProduto(): string { return this._nomeProduto };
    get descricaoProduto(): string { return this._descricaoProduto };
    get precoProduto(): number { return this._precoProduto };
    get quantidadeEstoque(): number { return this._quantidadeEstoque };
    get vinculoImagem(): string { return this._vinculoImagem };

    // --- SETTERS ---

    set nomeProduto(value: string) {
        this.validarNome(value);
        this._nomeProduto = value;
    }

    set idProduto(value: number) {
        this.validarId(value);
        this._idProduto = value;
    }

    set precoProduto(value: number) {
        this.validarPreco(value);
        this._precoProduto = value;
    }

    set vinculoImagem(value: string) {
        this.validarPathImagem(value);
        this._vinculoImagem = value;
    }

    set descricaoProduto(value: string) {
        this.validarDescricaoProduto(value);
        this._descricaoProduto = value;
    }

    set dataCad(value: string) {
        this._dataCad = value;
    }

    set dataMod(value: string) {
        this._dataMod = value;
    }

    // --- VALIDATIONS METHODS ---
    private validarNome(value: string) {
        if (value.trim().length < 4 || value.trim().length > 80 || !value || value === undefined || typeof value !== 'string' || value === '') {
            throw new Error('O nome do produto deve ser uma frase válida, de 4 a 80 caracteres.');
        }
    }

    private validarPathImagem(value: string) {
        if (!value || value.trim().length > 255 || value.trim().length < 10) {
            throw new Error('O path da imagem é obrigatório e deve ter entre 10 e 255 caracteres');
        }
    }
    private validarPreco(value: number) {
        if (value === undefined || isNaN(value) || value <= 0) {
            throw new Error('O preco do produto deve ser um número válido e maior que 0.');
        }
    }

    private validarId(value: number) {
        if (value === undefined || isNaN(value) || value < 0) {
            throw new Error('O ID deve ser um número válido.');
        }
    }

    private validarDescricaoProduto(value: string) {
        if (value === undefined || typeof value !== 'string' || value.length < 10 || value.length > 255 || value === '') {
            throw new Error('A descrição do produto relacionada deve existir, com mais de 10 caracteres e menos de 255.');
        }
    }

    private validarQuantidadeEstoque (value: number){
        if (value === undefined || isNaN(value) || value < 0){
            throw new Error('A quantidade no Estoque não pode ser menor do que zero.');
        }
    }

    // --- FACTORY METHODS ---
    static criar(dados: any) {
        return new Produto(
            dados.idProduto || null, 
            dados.idCategoria,
            dados.nome,
            dados.descricaoProduto,
            dados.preco,
            dados.quantidadeEstoque,
            dados.vinculoImagem,
            dados.dataCad,
            dados.dataMod
        );
    }

    static editar(id: number, dados: any) {
        return new Produto(
            id,
            dados.idCategoria,
            dados.nome,
            dados.descricaoProduto,
            dados.preco,
            dados.quantidadeEstoque,
            dados.vinculoImagem,
            dados.dataCad,
            dados.dataMod
        );
    }
}