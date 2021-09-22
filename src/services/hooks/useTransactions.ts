import { GetServerSidePropsContext } from "next";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { setupAPIClient } from "../api";

type Transaction = {
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

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function getTransactions(page: number, ctx: GetServerSidePropsContext = undefined): Promise<GetTransactionsResponse> {

  const api = setupAPIClient(ctx);

  const response = await api.get('transactions', {
    params: {
      page
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

export function useTransactions(page: number, options: UseQueryOptions): UseQueryResult<any, any> {
  const result = useQuery(['transactions-list', page], () => getTransactions(page), {
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