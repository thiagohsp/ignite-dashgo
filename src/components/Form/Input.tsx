import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, error, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput
        name={name}
        id={name}
        focusBorderColor="blue.500"
        boxShadow="lg"
        bg="white"
        variant="filled"
        _hover={{
          bg: 'gray.50'
        }}
        size="lg"
        ref={ref}
        autoComplete="off"
        {...rest}
      />

      { !!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )
      }
    </FormControl>
  );
}

export const Input = forwardRef(InputBase)