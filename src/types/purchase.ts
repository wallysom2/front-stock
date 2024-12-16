import { SaleProduct } from './sale';

export interface Contact {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
}

export interface Fornecedor {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: Contact;
}

export interface Purchase {
  id: number;
  vendaId: number;
  fornecedor: Fornecedor;
  produtos: SaleProduct[];
  valorTotal: number;
  formaPagamento: 'BOLETO' | 'PIX' | 'CARTAO_CREDITO';
  createdAt: string;
  venda?: any; // Optional to avoid circular dependency
}
