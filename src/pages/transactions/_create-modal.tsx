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
  Box
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { IBankAccount, IOption } from "../../interfaces";
import { api } from "../../services/apiClient";
import ReactSelect, { StylesConfig } from 'react-select'
import { theme } from "@chakra-ui/core";

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

      console.log(dataOptions)

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

      console.log(dataOptions)

      setCategoriesOptions(dataOptions)
    }
    
    loadCategoriesOptions();
  }, []) 


  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(undefined),
  });

  const { errors } = formState;

  const colourStyles: StylesConfig = {
    singleValue: (styles) => ({ ...styles, color: 'white', fontSize: '1.125rem' }),
    input: (styles ) => ({ ...styles, color: 'white', fontSize: '1.125rem' }),
    control: (styles, { isFocused,  }) => ({
       ...styles, 
       height: '3rem',
       border: `2px solid var(--chakra-colors-${ isFocused ? 'pink-500' : 'purple-900'})`,
       borderRadius: '6px',
       paddingLeft:'0.5rem',
       backgroundColor: 'var(--chakra-colors-purple-900)',
       boxShadow: 'none',
       ":hover": {
         border: `2px solid var(--chakra-colors-${ isFocused ? 'pink-500' : 'purple-900'})`,
       },
       ":focus-visible": {
         border: `2px solid var(--chakra-colors-${ isFocused ? 'pink-500' : 'purple-900'})`,
       },
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

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg="purple.800">
          <ModalHeader>Cadastrar Transação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Input placeholder="Descrição" name="title" />
              {/* <ComboBox name="bank_account_id">
                  { bankAccountsOptions.length && bankAccountsOptions.map((item) => (
                      <option value={item.value} style={{ color: "black" }}>{item.label}</option>
                    ))
                  }                
              </ComboBox> */}
              <ReactSelect
                name="bank_account"
                options={bankAccountsOptions}
                styles={colourStyles}
                isClearable
              />
              <ReactSelect
                name="category"
                options={categoriesOptions}
                styles={colourStyles}
                isClearable
              />
              <Input placeholder="Valor" name="amount" />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button colorScheme="pink" onClick={onClose}>Salvar</Button>
              <Button colorScheme="blue" onClick={onClose}>Cancelar</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
