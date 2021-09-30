import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput as ChakraNumberInput,
  NumberInputField as ChakraNumberInputField,
  NumberInputFieldProps as ChakraNumberInputProps
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";


interface InputProps extends ChakraNumberInputProps {
  name: string;
  label?: string;
  error?: FieldError
}

const NumberInputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, error, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraNumberInput
        size="lg"
        w="100%"
        precision={2}
        borderRadius={8}
        focusBorderColor="pink.500"
        bg="purple.900"
        variant="filled"
        _hover={{
          bg: "purple.900"
        }}
      >
        <ChakraNumberInputField
          name={name}
          id={name}
          boxShadow="lg"
          focusBorderColor="pink.500"
          bg="white"
          variant="filled"
          _hover={{
            bg: "gray.50"
          }}
          textAlign="right"
          autoComplete="off"
          {...rest} 
          ref={ref}
        >
        </ChakraNumberInputField>        
      </ChakraNumberInput>
      { !!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}

export const NumberInput = forwardRef(NumberInputBase)