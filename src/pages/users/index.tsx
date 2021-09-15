import { Box, Button, Checkbox, Flex, Heading, Icon, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import Sidebar from "../../components/Sidebar";
import { api } from "../../services/api";
import { getUsers, useUsers } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/queryClient";

export default function UsersList({ users }) {

  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useUsers(page, { initialData: users });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get(`users/${userId}`)
      return response.data;
    }, {
      staleTime: 1000 * 60 * 10 // 10 min. 
    })
  }

  return (
    <Flex direction="column" h="100vh">

      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          flex="1"
          bg="purple.800"
          p="8"
          borderRadius="lg">

          <Flex mb="8" justifyContent="space-between" align="center">

            <Heading size="lg" fontWeight="normal">
              Usuarios
              {!isLoading && isFetching && <Spinner size="sm" color="purple.300" ml={4} />}
            </Heading>

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </NextLink>

          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              Falha ao buscar dados dos usuários.
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Th px={["4", "4", "6"]} color="purple.300" width={8}>
                    <Checkbox colorScheme="pink" />
                  </Th>
                  <Th color="purple.300" >Nome</Th>
                  {isWideVersion && <Th color="purple.300">Data de criação</Th>}
                  {isWideVersion && <Th color="purple.300" width="8">Ação</Th>}
                </Thead>
                <Tbody>

                  {data.users.map((user) => (
                    <Tr key={user.id}>
                      <Td px={["4", "4", "6"]} color="purple.300" width={8}>
                        <Checkbox colorScheme="pink" />
                      </Td>
                      <Td>
                        <Box>
                          <Link href="" onMouseEnter={() => handlePrefetchUser(user.id)}>
                            <Text fontWeight="bold">{user.name}</Text>
                            <Text fontSize="sm" color="purple.300">{user.email}</Text>
                          </Link>
                        </Box>
                      </Td>

                      {isWideVersion && <Td>{user.createdAt}</Td>}

                      {isWideVersion && <Td>
                        <Button
                          as="a"
                          size="sm"
                          fontSize="sm"
                          colorScheme="purple"
                          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                        >
                          Editar
                        </Button>
                      </Td>}

                    </Tr>

                  ))}



                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
                onPageChange={(page) => { setPage(page) }}
              />
            </>
          )}


        </Box>
      </Flex>

    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { users, totalCount } = await getUsers(1);
  return {
    props: {
      users,
    }
  }
}