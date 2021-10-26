import {
  Button, 
  Modal, 
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  ModalOverlay, 
  Stack,
  HStack,
  ButtonGroup,
  Icon,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { NumberInput } from "../../components/Form/NumberInput";
import { IBankAccount, ICategory, IOption } from "../../interfaces";
import { api } from "../../services/apiClient";
import ReactSelect, { StylesConfig } from 'react-select'
import { RiArrowDownCircleFill, RiArrowUpCircleFill } from "react-icons/ri";
import { saveTransaction, SaveTransactionValues } from "../../services/hooks/useTransactions";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTransactionModal({
  isOpen,
  onClose,
}: CreateTransactionModalProps) {

  const [ bankAccountsOptions, setBankAccountsOptions ] = useState<IOption[]>([]);
  const [ categoriesOptions, setCategoriesOptions ] = useState<IOption[]>([]);
  const [ type, setType ] = useState<"income" | "expense">();
  
  useEffect(() => {
    async function loadBankAccountsOptions() {
      const bankAccounts = await api.get<IBankAccount[]>('/bank-account')
        .then(response => response.data)

      const dataOptions: IOption[] = bankAccounts.map((bankAccount) => {
        return {
          value: bankAccount.id,
          label: `${bankAccount.bank} | ${bankAccount.title}`
        }
      })

      setBankAccountsOptions(dataOptions)
    }
    
    loadBankAccountsOptions();
  }, []) 

  useEffect(() => {
    async function loadCategoriesOptions() {
      const categories = await api.get<ICategory[]>('/categories')
        .then(response => response.data)

      const dataOptions: IOption[] = categories.map((category) => {
        return {
          value: category.id,
          label: `${category.group} | ${category.description}`
        }
      })

      setCategoriesOptions(dataOptions)
    }
    
    loadCategoriesOptions();
  }, []) 


  const { register, handleSubmit, formState } = useForm();

  const { errors } = formState;

  const colourStyles: StylesConfig = {
    singleValue: (styles) => ({ ...styles, color: 'gray', fontSize: '1.125rem' }),
    input: (styles ) => ({ ...styles, color: 'gray', fontSize: '1.125rem' }),
    control: (styles, { isFocused,  }) => ({
       ...styles, 
       height: '3rem',
       borderRadius: '6px',
       paddingLeft:'0.5rem',
       //backgroundColor: 'var(--chakra-colors-purple-900)',
       boxShadow: 'lg',
       color: 'white'
    }),
    placeholder: (styles) => ({
      ...styles,
      fontFamily: 'inherit',
      fontSize: '1.125rem',
      color: 'var(--chakra-colors-gray-400)'
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'var(--chakra-colors-purple-900)'
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled ? undefined 
        : isSelected
          ? 'var(--chakra-colors-purple-500)'
          : isFocused 
          ? 'var(--chakra-colors-purple-800)'
          : undefined
          
    }),
    indicatorSeparator: (styles) => ({
      ...styles, background: 'transparent'
    })
  }

  const handleSaveTransaction: SubmitHandler<SaveTransactionValues> = async (values) => {
    await saveTransaction(values);
  }

  return (
    <>
      <Modal 
        onClose={onClose} 
        isOpen={isOpen} 
        
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          as="form" 
          bg="twitter.50"
          boxShadow="md"
          borderRadius={16} 
          p={4}
          onSubmit={handleSubmit(handleSaveTransaction)}
        >
          <ModalHeader>
            <Heading size="md" fontWeight="normal">
              Cadastrar Transações
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Input 
                placeholder="Descrição" 
                name="title"
                {...register('title')} 
              />
              
              <ReactSelect
                name="bank_account_id"
                options={bankAccountsOptions}
                styles={colourStyles}
                isClearable
                {...register('bank_account_id')} 
              />

              <ReactSelect
                name="category_id"
                options={categoriesOptions}
                styles={colourStyles}
                isClearable
                {...register('category_id')} 
              />

              <ButtonGroup
                variant="outline"
                size="lg"
                spacing={4}
                w="100%"  
              >
                <Button 
                  border="2px solid"
                  borderColor="teal.500"
                  color="teal.500"
                  w="100%"
                  height="5rem"
                  leftIcon={<Icon as={RiArrowUpCircleFill} fontSize="20" />}
                  _focus={{
                    bg: "teal.200"
                  }}
                  _hover={{
                    bg: "teal.200"
                  }}
                  bg={type === 'income' && 'teal.200'}
                  onClick={() => setType('income')}
                >
                  Entrada
                </Button>
                <Button
                  border="2px solid"
                  borderColor="pink.600"
                  color="pink.600" 
                  w="100%"
                  height="5rem"
                  leftIcon={<Icon as={RiArrowDownCircleFill} fontSize="20" />}
                  _focus={{
                    bg: "pink.200"
                  }}
                  _hover={{
                    bg: "pink.200"
                  }}
                  bg={type === 'expense' && 'pink.200'}
                  onClick={() => setType('expense')}
                >
                  Saída
                </Button>

             </ButtonGroup>

              <NumberInput
                name="amount"
                placeholder="Valor"
                textAlign="right"
                float="right" 
                {...register('amount')} 
              />

              
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button colorScheme="pink" type="submit">Salvar</Button>
              <Button colorScheme="blue" onClick={onClose}>Cancelar</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
