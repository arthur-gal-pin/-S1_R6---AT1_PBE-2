import { enumStatusPedido } from "../enum/statusPedido";

export class Pedidos {
    private _idPedido: number | null;
    private _subTotal: number;
    private _status: enumStatusPedido;
    private _dataCad: string;
    private _dataMod: string;

    // --- CONSTRUCTOR --- 
    constructor(
        idPedido: number | null,
        subTotal: number = 0,
        status: enumStatusPedido = enumStatusPedido.Pendente,
        dataCad: string,
        dataMod: string
    ) {
        if (idPedido !== null) this.validarId(idPedido);
        this.validarSubTotal(subTotal);
        this.validarStatus(status);

        this._idPedido = idPedido;
        this._subTotal = subTotal;
        this._status = status;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idPedido(): number | null { return this._idPedido; }
    get subTotal(): number { return this._subTotal; }
    get status(): string { return this._status; }
    get dataCad(): string { return this._dataCad; }
    get dataMod(): string { return this._dataMod; }

    //--- SETTERS ---
    set id(value: number | null) {
        if (value !== null) {
            this.validarId(value);
        }
        this._idPedido = value;
    }

    set subTotal(value: number) {
        this.validarSubTotal(value);
        this._subTotal = value;
    }

    set status(value: enumStatusPedido) {
        this.validarStatus(value);
        this._status = value;
    }

    set dataCad(value: string) {
        this._dataCad = value;
    }

    set dataMod(value: string) {
        this._dataMod = value;
    }


    // --- VALIDATIONS METHODS ---
    private validarId(value: number) {
        if (value === undefined || isNaN(value) || value <= 0) {
            throw new Error('O ID deve ser um número válido.');
        }
    }

    private validarSubTotal(value: number) {
        if (value === undefined || isNaN(value) || value <= 0) {
            throw new Error('O SUbtotal deve ser um número racional maior que 0.')
        }
    }

    private validarStatus(value: enumStatusPedido) {
        if (!Object.values(enumStatusPedido).includes(value)) {
            throw new Error('Esse status para pedido é inválido.')
        }
    }

    // --- FACTORY METHODS ---
    static criar(dados: any) {
        return new Pedidos(
            dados.idPedido,
            dados.subTotal,
            dados.status,
            dados.dataCad,
            dados.dataMod);
    }

    static editar(dados: any, id: number) {
        return new Pedidos(id, dados.subTotal, dados.status, dados.dataCad, new Date().toISOString());
    }
}