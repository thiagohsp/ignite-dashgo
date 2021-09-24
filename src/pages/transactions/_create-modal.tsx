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
import { ComboBox } from "../../components/Form/ComboBox";
import { IBankAccount, IOption } from "../../interfaces";
import { api } from "../../services/apiClient";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTransactionModal({
  isOpen,
  onClose,
}: CreateTransactionModalProps) {

  const [ bankAccountsOptions, setBankAccountsOptions ] = useState<IOption[]>([]);
  
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


  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(undefined),
  });

  const { errors } = formState;

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
              <ComboBox name="bank_account_id">
                  { bankAccountsOptions.length && bankAccountsOptions.map((item) => (
                      <option value={item.value} style={{ color: "black" }}>{item.label}</option>
                    ))
                  }                
              </ComboBox>

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
