export class Categoria {
    private _idCategoria: number | null = null;
    private _nomeCategoria: string = '';
    private _descricao: string | null = '';
    private _dataCad: string;
    private _dataMod: string;

    // --- CONSTRUCTOR ---
    constructor(idCategoria: number | null = null, nomeCategoria: string, descricao: string, dataCad: string, dataMod: string) {
        if(idCategoria !== null) this.validarId(idCategoria);
        this.validarNome(nomeCategoria);
        this.validarDescricao(descricao);
        
        this._idCategoria = idCategoria;
        this._nomeCategoria = nomeCategoria;
        this.descricao = descricao;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get nomeCategoria(): string { return this._nomeCategoria; }
    get descricao(): string | null { return this._descricao; }
    get idCategoria(): number | null { return this._idCategoria; }

    //--- SETTERS ---
    set nomeCategoria(value: string) {
        this.validarNome(value)
        this._nomeCategoria = value;
    }

    set descricao(value: string | null) {
        this.validarDescricao(value);
        this._descricao = value;
    }

    set idCategoria(value: number) {
        this.validarId(value);
        this._idCategoria = value;
    }

    set dataCad(value: string) {
        this._dataCad = value;
    }

    set dataMod(value: string) {
        this._dataMod = value;
    }

    // --- VALIDATIONS METHODS ---
    private validarNome(value: string) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error('O campo nome é obrigatório e deve conter entre 3 e 45 caracteres');
        }
    }
    private validarDescricao(value: string | null) {
        if (value && (value.trim().length > 150 || value.trim().length < 5)) {
            throw new Error('O campo descrição deve ter entre 5 e 150 caracteres');
        }
    }
    private validarId(value: number) {
        // Se não for null, deve ser um número positivo e válido
        if (isNaN(value) || value <= 0) {
            throw new Error('O ID deve ser um número válido e maior que zero');
        }
    }

    // --- FACTORY METHODS ---
    static criar(dados: any) {
        return new Categoria(null, dados.nome, dados.descricao, dados.dataCad, dados.dataMod);
    }
    static editar(id: number, dados: any) {
        return new Categoria(id, dados.nome, dados.descricao, dados.dataCad, dados.dataMod);
    }
}