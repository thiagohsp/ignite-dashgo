import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import Sidebar from "../../components/Sidebar";
import { generateFakeTransactions, getTransactions, useTransactions } from "../../services/hooks/useTransactions";
import { withSSRAuth } from "../../utils/withSSRAuth";
import CreateTransactionModal from "./_create-modal";

export default function TransactionsList({ transactions, totalCount }) {

  const [ isOpenModal, setIsOpenModal ] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching, isFetched } = useTransactions(page, {
    placeholderData: () => {
      const fakeTransactions = generateFakeTransactions()
      return {
        totalCount: 1,
        transactions: fakeTransactions
      }
    }
  });

  const handleOnCloseModal = () => {
    setIsOpenModal(false);
  }

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <CreateTransactionModal 
        isOpen={isOpenModal}
        onClose={handleOnCloseModal}
      />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" bg="purple.800" p="8" borderRadius="lg">
          <Flex mb="8" justifyContent="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Transações
              {!isLoading && isFetching && (
                <Spinner size="sm" color="purple.300" ml={4} />
              )}
            </Heading>

            <Button
              size="sm"
              fontSize="sm"
              colorScheme="pink"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              onClick={() => setIsOpenModal(true)}
            >
              Criar novo
            </Button>
          </Flex>

          { error ? (
            <Flex justify="center">Falha ao buscar dados das transações.</Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Th color="purple.300" w={48}>Data</Th>
                  <Th color="purple.300">Descrição</Th>
                  <Th color="purple.300" w={32} textAlign="right">Valor</Th>
                </Thead>
                <Tbody>
                  {data.transactions?.length && data.transactions.map((transaction) => (
                    <Tr key={transaction.id}>
                      <Td>{transaction.transactionDate}</Td>
                      <Td>
                        <Box>
                          <Link href="">
                            <Text fontWeight="bold">{transaction.title}</Text>
                            <Text fontSize="sm" color="purple.300">
                              {`${transaction.category?.group} | ${transaction.category?.description}`}
                            </Text>
                          </Link>
                        </Box>
                      </Td>
                      <Td textAlign="right">
                        <Text color={ transaction.type === 'income' ? "green.300" : "red.300"}> {transaction.amount} </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={totalCount}
                currentPage={page}
                onPageChange={(page) => {
                  setPage(page);
                }}
              />
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}


export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx: GetServerSidePropsContext) => {
  const { transactions, totalCount } = await getTransactions(1, ctx);
  return {
    props: {
      transactions,
      totalCount
    },
  };
});
