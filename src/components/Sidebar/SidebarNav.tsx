import { Stack } from "@chakra-ui/react";
import { RiContactsLine, RiDashboard2Line } from "react-icons/ri";
import MenuGroup from "./MenuGroup";
import MenuItem from "./MenuItem";

export default function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <MenuGroup title="GERAL">
        <MenuItem href="/dashboard" icon={RiDashboard2Line}>Dashboard</MenuItem>
        <MenuItem href="/users" icon={RiContactsLine}>Usuários</MenuItem>
      </MenuGroup>
    </Stack>
  )
}