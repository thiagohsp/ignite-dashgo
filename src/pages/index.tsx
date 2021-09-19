import { Button, Flex, Stack } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import Router from "next/router";
import { useContext } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Input } from "../components/Form/Input";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

type SigInFormData = {
  email: string;
  password: string;
}

export default function SignIn() {

  const { isAuthenticated, signIn } = useContext(AuthContext)

  if (isAuthenticated) {
    Router.push('/dashboard')
  }

  const signInFormSchema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required()
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SigInFormData> = async (values) => {
    await signIn(values);
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
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing={4}>

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
          Entrar
        </Button>
      </Flex>

    </Flex>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});