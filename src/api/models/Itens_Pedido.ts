export class ItensPedido {
    private _id: number | null;
    private _idPedido: number;
    private _idProduto: number;
    private _quantidade: number;
    private _valor: number;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        id: number | null = null,
        pedidoId: number = 0,
        produtoId: number = 0,
        valor: number = 0,
        quantidade: number = 0,
        dataCad: string,
        dataMod: string
    ) {
        // Validações disparadas na construção do objeto
        if (id !== null) this.validarId(id);
        if (pedidoId > 0) this.validarIdAuxiliar(pedidoId);
        if (produtoId > 0) this.validarIdAuxiliar(produtoId);
        this.validarValor(valor);
        this.validarQuantidade(quantidade);

        this._id = id;
        this._idPedido = pedidoId;
        this._idProduto = produtoId;
        this._valor = valor;
        this._quantidade = quantidade;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // ---GETTERS--
    get id(): number | null { return this._id; }
    get pedidoId(): number { return this._idPedido; }
    get produtoId(): number { return this._idProduto; }
    get valor(): number { return this._valor; }
    get quantidade(): number { return this._quantidade; }
    get dataCad(): string { return this._dataCad; }
    get dataMod(): string { return this._dataMod; }

    // --- SETTERS ---
    set id(value: number | null) {
        if (value !== null) this.validarId(value);
        this._id = value;
    }

    set pedidoId(value: number) {
        this.validarIdAuxiliar(value);
        this._idPedido = value; 
        console.log("TESTE");
    }

    set produtoId(value: number) {
        this.validarIdAuxiliar(value);
        this._idProduto = value;
    }

    set valor(value: number) {
        this.validarValor(value);
        this._valor = value;
    }

    set quantidade(value: number) {
        this.validarQuantidade(value);
        this._quantidade = value;
    }

    // --- VALIDATIONS METHODS ---
    private validarId(value: number) {
        if (isNaN(value) || value <= 0) {
            throw new Error('O ID deve ser um número válido e maior que zero.');
        }
    }

    private validarIdAuxiliar(value: number) {
        if (!value || isNaN(value) || value <= 0) {
            throw new Error('O ID auxiliar (Pedido/Produto) deve ser um número válido.');
        }
    }

    private validarValor(value: number) {
        if (value === undefined || isNaN(value) || value < 0) {
            throw new Error('O valor deve ser um número racional maior ou igual a 0.');
        }
    }

    private validarQuantidade(value: number) {
        if (!value || isNaN(value) || value <= 0) {
            throw new Error('A quantidade deve ser um número maior que zero.');
        }
    }

    // --- STATIC METHODS ---
    static calcularSubTotal(itens: ItensPedido[]): number {
        return Math.round((itens.reduce((total, item) => total + (item.valor * item.quantidade), 0) * 100) / 100);
    }

    // --- FACTORY METHODS ---
    static criar(dados: any): ItensPedido {
        return new ItensPedido(
            dados.id || null, 
            dados.pedidoId || 0, 
            dados.produtoId, 
            dados.valor, 
            dados.quantidade,
            dados.dataCad,
            dados.dataMod
        );
    }

    static editar(dados: any, id: number): ItensPedido {
        return new ItensPedido(
            id, 
            dados.pedidoId, 
            dados.produtoId, 
            dados.valor, 
            dados.quantidade,
            dados.dataCad,
            dados.dataMod
        );
    }
}