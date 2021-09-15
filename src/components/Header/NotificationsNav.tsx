import { HStack, Icon } from "@chakra-ui/react";
import { RiNotificationLine, RiUserAddLine } from "react-icons/ri";

export default function NotificationsNav() {
  return (
    <HStack
      spacing={["6", "8"]}
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      color="purple.300"
      borderRightWidth={2}
      borderColor="purple.700"
    >

      <Icon as={RiNotificationLine} fontSize="20" />

      <Icon as={RiUserAddLine} fontSize="20" />

    </HStack>
  )
}