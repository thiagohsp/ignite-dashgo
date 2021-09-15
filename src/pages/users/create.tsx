import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from "react-query";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { useRouter } from "next/router";

type CreateUserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function CreateUser() {

  const router = useRouter();

  const createUser = useMutation(async (user: CreateUserFormData) => {
    const response = await api.post('users', {
      user: {
        ...user,
        created_at: new Date()
      }
    });

    return response.data.user;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })

  const createUserFormSchema = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    email: yup.string().required('Campo obrigatório').email('E-mail inválido'),
    password: yup.string().required('Campo obrigatório').min(6, 'Mínimo 6 dígitos/caracteres'),
    password_confirmation: yup.string().oneOf([
      null,
      yup.ref('password')
    ], 'Confirmação divergente')
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema)
  });

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
    await createUser.mutateAsync(values);
    router.push('/users')
  }

  return (
    <Flex direction="column" h="100vh">

      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          bg="purple.800"
          p={["6", "8"]}
          borderRadius="lg"
          onSubmit={handleSubmit(handleCreateUser)}
        >

          <Heading size="lg" fontWeight="normal">Criar Usuários</Heading>

          <Divider my="6" borderColor="purple.600" />

          <VStack spacing={["6", "8"]}>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w='100%'>
              <Input
                name="name"
                type="text"
                label="Nome Completo"
                {...register('name')}
              />

              <Input
                name="email"
                type="email"
                label="Email"
                {...register('email')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w='100%'>
              <Input
                name="password"
                type="password"
                label="Senha"
                {...register('password')}
              />

              <Input
                name="password_confirmation"
                type="password"
                label="Confirme sua senha"
                {...register('password_confirmation')}
              />
            </SimpleGrid>

          </VStack>

          <Flex mt={["6", "8"]} justify='flex-end'>

            <HStack spacing="4">

              <Link href="/users" passHref>
                <Button colorScheme='whiteAlpha'>Cancelar</Button>
              </Link>

              <Button
                type="submit"
                colorScheme='pink'
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>

            </HStack>

          </Flex>

        </Box>

      </Flex>

    </Flex>
  )
}