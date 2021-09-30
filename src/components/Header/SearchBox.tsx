import { Flex, Icon, Input } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";

export default function SearchBox() {
  return (
    <Flex
      as="label"
      flex="1"
      py="4" px="4" ml="6"
      maxWidth={480}
      alignSelf="center"
      color="pink.500"
      pos="relative"
      bg="white"
      borderRadius="full"
    >
      <Input
        color="gray.500"
        variant="unstyled"
        px="4" mr="4"
        placeholder="Buscar na plataforma"
        _placeholder={{ color: 'gray.200' }}
      />

      <Icon as={RiSearchLine} fontSize="24" />

    </Flex>
  )
}