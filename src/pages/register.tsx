import { Button, Flex, Stack } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import Router from "next/router";
import { useContext } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Input } from "../components/Form/Input";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/apiClient";
import { withSSRGuest } from "../utils/withSSRGuest";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
}

export default function Register() {

  const signInFormSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required()
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const { errors } = formState;

  const handleRegisterUser: SubmitHandler<RegisterFormData> = async (values) => {
    await api.post('/users', values).then((response) => {
      Router.push('/')
    })
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">

      <Flex
        as="form"
        flexDir="column"
        width="100%"
        maxWidth={360}
        bg="purple.800"
        p="8"
        borderRadius={8}
        onSubmit={handleSubmit(handleRegisterUser)}
      >
        <Stack spacing={4}>

          <Input
            name="name"
            label="Nome"
            error={errors.name}
            {...register('name')}
          />

          <Input
            name="email"
            type="email"
            label="E-mail"
            error={errors.email}
            {...register('email')}
          />

          <Input
            name="password"
            type="password"
            label="Senha"
            error={errors.password}
            {...register('password')}
          />

        </Stack>

        <Button
          type="submit"
          mt="6"
          colorScheme="pink"
          size="lg"
          isLoading={formState.isSubmitting}>
          Cadastrar
        </Button>
      </Flex>

    </Flex>
  )
}
