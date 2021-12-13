import { Box, Flex, Heading, SimpleGrid, Stack, Text, HStack, Select, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import CategoriesTotalsTable from "../components/CategoriesTotalsTable";
import IncomeXExpensesLinearGraph from "../components/Graphs/IncomeXExpensesLinearGraph";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { getAllTransactions, Transaction, useTransactions } from "../services/hooks/useTransactions";
import { withSSRAuth } from "../utils/withSSRAuth";


export default function Dashboard({ dashboards }) {

  const [bankAccountBalances, setBankAccountBalances] = useState([]);
  const [totals, setTotals] = useState({totalIncome: 0, totalExpense: 0});
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);

  useEffect(() => {
    

    async function loadTransactions() {
      const transactions = await getAllTransactions({page: 0, perPage: 999 })
        .then((response) => response.transactions )

      setTransactions(transactions);
    }

    async function loadBalances() {
      const accountsBalance = await api.get('balance').then((response) => {
        return response.data
      })

      setBankAccountBalances(accountsBalance)
    }

    loadBalances()

    loadTransactions()
    
  }, []);

  useEffect(() => {
    if (!dashboards) return;

    const { incomeExpenseReportData } = dashboards;

    const data = Object.keys(incomeExpenseReportData).map(item => {return { income: incomeExpenseReportData[item].income, expense: incomeExpenseReportData[item].expense }})
    
    //console.log(data)
    const { totalIncome, totalExpense } = data.reduce((acc, cur) => {
      return {
        totalIncome:  cur.income + acc.totalIncome,
        totalExpense: cur.expense + acc.totalExpense,
      }
    }, {
      totalIncome: 0,
      totalExpense: 0
    })

    setTotals({ totalIncome, totalExpense });
  }, [dashboards])
  
  return (
    <Flex direction="column" h="100vh">

      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Stack w="100%">

          <HStack>
            <Select
              defaultValue={0}
            >
              <option value="0">Ano atual</option>
              <option value="12" >12 meses</option>
              <option value="6" >6 meses</option>
              <option value="3" >3 meses</option>
              <option value="1" >Mês Atual</option>
            </Select>
          </HStack>

          <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">

            <Box
              p={["6", "8"]}
              bg="white"
              borderRadius={8}
              pb="4"
            >
              
              <Heading size="md" mb="4">Saldos das Contas</Heading>
              <Stack>

                { bankAccountBalances.length > 0 && bankAccountBalances.map((account) => (
                  <Flex color="gray.300" fontSize="sm" borderBottom="1px solid lightgray" py={1}>
                    <Text flex={1}>{account.account_title}</Text>
                    <Text
                      color={Math.sign(account?.balance) >= 0 ? "green.400" : "red.400"}
                    >
                      {Number(account?.balance || 0).toLocaleString('pt-BR', {currency: 'BRL', style: 'currency'})}</Text>
                  </Flex>
                  )
                )}

              </Stack>
            </Box>

            <Box
              p={["6", "8"]}
              bg="white"
              borderRadius={8}
              pb="4"
            >
              <IncomeXExpensesLinearGraph 
                data={dashboards?.incomeExpenseReportData}               
              />
              <StatGroup p={4}>
                <Stat>
                  <StatNumber textAlign="center">
                    <StatArrow type="increase" />
                    {Number(totals.totalIncome).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </StatNumber>
                </Stat>
                <Stat>
                <StatNumber textAlign="center">
                    <StatArrow type="decrease" />
                    {Number(totals.totalExpense).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </StatNumber>
                </Stat>
              </StatGroup>
            </Box>

            
          </SimpleGrid>
        </Stack>
      </Flex>
      <CategoriesTotalsTable data={dashboards.categoriesReportData} />
    </Flex>

  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx: GetServerSidePropsContext) => {
  
  const api = setupAPIClient(ctx);

  const { data } = await api.get('dashboard');

  return {
    props: {
      dashboards: data
    },
  };
});