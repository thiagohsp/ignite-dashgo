import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";


interface InputProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, InputProps> = ({ name, label, error, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraSelect
        name={name}
        id={name}
        focusBorderColor="pink.500"
        bg="purple.900"
        variant="filled"
        _hover={{
          bg: "purple.900"
        }}
        size="lg"
        ref={ref}
        {...rest}
      />

      { !!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )
      }
    </FormControl>
  );
}

export const ComboBox = forwardRef(SelectBase)