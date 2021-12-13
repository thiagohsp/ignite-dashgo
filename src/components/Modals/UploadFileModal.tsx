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
import Dropzone from "react-dropzone";

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadFileModal({
  isOpen,
  onClose
}: UploadFileModalProps) {

  const { register, handleSubmit } = useForm();
  
  const handleSaveTransaction: SubmitHandler<SaveTransactionValues> = async (values) => {
    await saveTransaction({ values, isEditing: false });
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
              Importar arquivo
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Dropzone />
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
