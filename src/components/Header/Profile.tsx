import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData?: boolean
}

export default function Profile({ showProfileData = true }: ProfileProps) {

  const { user } = useContext(AuthContext);

  return (
    <Flex align="center">

      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="purple.500" fontSize="x-small">{user?.email}</Text>
        </Box>
      )}

      <Avatar size="md" name="Thiago Pereira" src="https://github.com/thiagohsp.png" />
    </Flex>
  )
}