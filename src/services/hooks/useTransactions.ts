import { GetServerSidePropsContext } from "next";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { number } from "yup/lib/locale";
import { setupAPIClient } from "../api";
import { api } from "../apiClient";

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: string;
  transaction_date: string;
  category: {
    id: number;
    group: string;
    description: string;
    type: string;
    is_hide: boolean;
  };
  bankAccount: {
    id: number;
    bank: string;
    title: string;
  };
}

type GetTransactionsResponse = {
  transactions: Transaction[];
  totalCount: number;
}

export interface SaveTransactionValues {
  id?: number;
  title: string;
  amount: number;
  type: string;
  transaction_date: string;
  category_id: number;
  bank_account_id: number;
}

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function getAllTransactions(params: GetTransactionsRequestParams, ctx: GetServerSidePropsContext = undefined): Promise<GetTransactionsResponse> {

  const { bankAccount } = params

  const api = setupAPIClient(ctx);

  const response = await api.get('transactions', {
    params: {
      page: 1, 
      per_page: 999, 
      bank_account: bankAccount
    }
  });

  const {data} = response;

  const totalCount = data.meta.total // Number(headers['x-total-count'])

  const transactions = data.data.map(transaction => {
    return {
      ...transaction,
      amount: Number(transaction.amount).toLocaleString('pt-BR', {
        useGrouping: true,
        minimumFractionDigits: 2
      }),
      transactionDate: new Date(transaction.transaction_date).toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
        dateStyle: 'short'
      })
    }
  });

  return {
    totalCount,
    transactions,
  }
}

export async function getTransactions(params: GetTransactionsRequestParams, ctx: GetServerSidePropsContext = undefined): Promise<GetTransactionsResponse> {

  const { page, perPage, bankAccount } = params

  const api = setupAPIClient(ctx);

  const response = await api.get('transactions', {
    params: {
      page, 
      per_page: perPage, 
      bank_account: bankAccount
    }
  });

  const {data} = response;

  const totalCount = data.meta.total // Number(headers['x-total-count'])

  const transactions = data.data.map(transaction => {
    return {
      ...transaction,
      amount: Number(transaction.amount).toLocaleString('pt-BR', {
        useGrouping: true,
        minimumFractionDigits: 2
      }),
      transactionDate: new Date(transaction.transaction_date).toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
        dateStyle: 'short'
      })
    }
  });

  return {
    totalCount,
    transactions,
  }
}

interface GetTransactionsRequestParams {
  page: number,
  perPage: number,
  bankAccount?: number
}

export function useTransactions(page: number, bankAccount: number = undefined, options: UseQueryOptions): UseQueryResult<any, any> {
  const result = useQuery(['transactions-list', page, bankAccount], () => getTransactions({ page, perPage: 10, bankAccount}), {
    staleTime: 1000 * 60 * 1,
    ...options
  })
  return  result;
}

export function generateFakeTransactions(size = 10): Transaction[] {
  return [...new Array(size)].map((transaction, index) => {
    return {
      id: index,
      title: 'Carregando ...',
      amount: null,
      type: '',
      transaction_date: '01/01/2021',
      category: {
        id: 0,
        group: 'Carregando ...',
        description: '',
        type: '',
        is_hide: false,
      },
      bankAccount: {
        id: 0,
        bank: '',
        title: '',
      }
    }
  })
}

interface SaveTransactionParams {
  isEditing: boolean,
  values: SaveTransactionValues
}
export async function saveTransaction({ values , isEditing = false}: SaveTransactionParams) {
  const method = isEditing ? api.post : api.put;
  const url = [ '/transactions', isEditing && String(values.id)].join('/')
  return await method(url, values) 
}