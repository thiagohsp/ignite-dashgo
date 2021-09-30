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
          <Text color="white" fontWeight="bold">{user?.name}</Text>
          <Text color="whiteAlpha.700" fontSize="x-small">{user?.email}</Text>          
        </Box>
      )}

      <Avatar 
        size="lg" 
        name="Thiago Pereira" 
        src="https://github.com/thiagohsp.png"
        border="3px solid white"
        boxShadow="lg"
      />
      
      <Flex
        ml={["4", "6"]}
        pl={["4", "6"]}
        height={8}
        color="white"
        borderLeftWidth={2}
        borderColor="whiteAlpha.500"
        placeItems="center"
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