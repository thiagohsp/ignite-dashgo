import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
  page: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationItem({ page, isCurrent = false, onPageChange }: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="pink"
        disabled
        _disabled={{
          bg: 'pink.500',
          cursor: 'default'
        }}
      >
        {page}
      </Button>
    )
  }
  return (
    <Button
      size="sm"
      fontSize="xs"
      width="4"
      bg="purple.700"
      _hover={{
        bg: 'purple.500'
      }}
      onClick={() => onPageChange(page)}
    >
      {page}
    </Button>

  )
}