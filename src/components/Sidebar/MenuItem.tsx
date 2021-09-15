import { Icon, Link as ChakraLink, Text } from "@chakra-ui/react";
import { ElementType } from "react";
import Link from 'next/link'
import ActiveLink from "../ActiveLink";

interface MenuItemProps {
  href: string;
  icon: ElementType;
  children: string;
}

export default function MenuItem({ icon, children, href, ...rest }: MenuItemProps) {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink display="flex" align="center" {...rest} >
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">{children}</Text>
      </ChakraLink>
    </ActiveLink>
  )
}