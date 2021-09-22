import { Avatar, Box, Flex, Text, Icon, HStack} from "@chakra-ui/react";
import { useContext } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { AuthContext } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData?: boolean
}

export default function Profile({ showProfileData = true }: ProfileProps) {

  const { user, signOut } = useContext(AuthContext);

  return (
    <Flex align="center">

      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="purple.300" fontSize="x-small">{user?.email}</Text>          
        </Box>
      )}

      <Avatar size="md" name="Thiago Pereira" src="https://github.com/thiagohsp.png" />
      
      <Flex
        ml={["4", "6"]}
        pl={["4", "6"]}
        color="purple.300"
        borderLeftWidth={2}
        borderColor="purple.700"
      >

        <Icon 
          as={RiLogoutBoxLine} 
          fontSize="20"
          onClick={signOut} 
        />

      </Flex>
    </Flex>
  )
}