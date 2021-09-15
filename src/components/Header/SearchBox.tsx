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
      color="purple.200"
      pos="relative"
      bg="purple.800"
      borderRadius="full"
    >
      <Input
        color="green.50"
        variant="unstyled"
        px="4" mr="4"
        placeholder="Buscar na plataforma"
        _placeholder={{ color: 'purple.400' }}
      />

      <Icon as={RiSearchLine} fontSize="20" />

    </Flex>
  )
}