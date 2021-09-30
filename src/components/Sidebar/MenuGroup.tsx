import { Box, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MenuGroupProps {
  title: string;
  children: ReactNode
}

export default function MenuGroup({ title, children }: MenuGroupProps) {
  return (
    <Box>
      <Text fontWeight="bold" color="twitter.500" fontSize="small">
        {title}
      </Text>
      <Stack spacing="4" mt="8" align="stretch">
        {children}
      </Stack>
    </Box>
  )
}