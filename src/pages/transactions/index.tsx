import {
  Badge,
  Box,
  Button, ButtonGroup, Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { RiAddLine, RiFilterFill, RiFilterLine, RiSave3Fill } from "react-icons/ri";
import ReactSelect from 'react-select';
import Header from "../../components/Header";
import CreateTransactionModal from "../../components/Modals/CreateTransactionModal";
import Pagination from "../../components/Pagination";
import Sidebar from "../../components/Sidebar";
import { IBankAccount, IOption } from '../../interfaces';
import { api } from '../../services/apiClient';
import { generateFakeTransactions, getTransactions, useTransactions } from "../../services/hooks/useTransactions";
import { withSSRAuth } from "../../utils/withSSRAuth";


export default function TransactionsList({ transactions, totalCount }) {

  const [ isOpenModal, setIsOpenModal ] = useState(false);
  const [ bankAccountsOptions, setBankAccountsOptions ] = useState<IOption[]>([]);
  const [ bankAccount, setBankAccount ] = useState<number>();
  const [ totalRegistersCount, setTotalRegistersCount ] = useState(totalCount)

  const [page, setPage] = useState(1);

  const colors = [
    "whiteAlpha",
    "red" ,
    "orange" ,
    "yellow" ,
    "green" ,
    "teal" ,
    "blue" ,
    "cyan" ,
    "purple" ,
    "pink" ]

  useEffect(() => {
    async function loadBankAccountsOptions() {
      const bankAccounts = await api.get<IBankAccount[]>('/bank-account')
        .then(response => response.data)

      const dataOptions: IOption[] = bankAccounts.map((bankAccount) => {
        return {
          value: bankAccount.id,
          label: `${bankAccount.bank}, ${bankAccount.title}`
        }
      })

      setBankAccountsOptions(dataOptions)
    }

    loadBankAccountsOptions()
  }, []);

  const { data, isLoading, error, isFetching, isFetched } = useTransactions(page, bankAccount , {
    placeholderData: () => {
      const fakeTransactions = generateFakeTransactions()
      return {
        totalCount: 1,
        transactions: fakeTransactions
      }
    }
  });

  useEffect(() => {
    setTotalRegistersCount(data.totalCount)
  }, [data])

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

        <Box flex="1" bg="white" p="8" borderRadius="lg" boxShadow="inner" >
          <Flex mb="8" justifyContent="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Transações
              {!isLoading && isFetching && (
                <Spinner size="sm" color="purple.300" ml={4} />
              )}
            </Heading>

            <ButtonGroup>

              <Button
                size="md"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                onClick={() => setIsOpenModal(true)}
              >
                Criar novo
              </Button>
              <Button
                size="md"
                fontSize="sm"
                colorScheme="twitter"
                leftIcon={<Icon as={RiSave3Fill}   fontSize="20" />}
                onClick={() => setIsOpenModal(true)}
              >
                Importar arquivo
              </Button>
            </ButtonGroup>
          </Flex>

          { error ? (
            <Flex justify="center">Falha ao buscar dados das transações.</Flex>
          ) : (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th color="gray.300" w={48}>Data</Th>
                    <Th color="gray.300">Descrição</Th>
                    <Th color="gray.300">
                      <Popover>
                      {({ isOpen, onClose }) => (
                        <>
                          <PopoverTrigger>
                            <Button 
                              cursor="pointer"
                              py={4}
                              size="xs" 
                              as="th" 
                              variant="ghost"
                              leftIcon={ bankAccount ? <RiFilterFill size={18}/> : <RiFilterLine size={18}/>}
                            >Conta</Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Filter Account</PopoverHeader>
                            <PopoverBody>
                              <ReactSelect
                                name="bank_account_id"
                                options={bankAccountsOptions}
                                isClearable 
                                onChange={(event) => {
                                  setBankAccount(Number(event?.value) || null)
                                  onClose()
                                }}
                              />
                            </PopoverBody>
                          </PopoverContent>
                        </>
                      )}
                      </Popover>                      
                    </Th>
                    <Th color="gray.300" w={32} textAlign="right">Valor</Th>
                  </Tr>
                </Thead>
                <Tbody color="gray.400">
                  {data.transactions?.length && data.transactions.map((transaction) => (
                    <Tr key={transaction.id}>
                      <Td>{transaction.transactionDate}</Td>
                      <Td>
                        <Box flex={1}>
                          <Link href="">
                            <Text fontWeight="bold">{transaction.title}</Text>
                            <Text fontSize="sm" color="gray.200">
                              {`${transaction.category?.group} | ${transaction.category?.description}`}
                            </Text>
                          </Link>
                        </Box>
                      </Td>
                      <Td>
                        <Badge colorScheme={colors[transaction.bankAccount.id]} px={4} py={2}>
                          {`${transaction.bankAccount.bank} -  ${transaction.bankAccount.title}`}
                        </Badge>
                      </Td>
                      <Td textAlign="right">
                        <Text color={ transaction.type === 'income' ? "green.300" : "red.300"}> {transaction.amount} </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={totalRegistersCount}
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
  const { transactions, totalCount } = await getTransactions({ page: 1, perPage: 10 }, ctx);
  return {
    props: {
      transactions,
      totalCount
    },
  };
});
