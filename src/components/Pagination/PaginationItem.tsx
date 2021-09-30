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
        fontSize="sm"
        width="4"
        colorScheme="twitter"
        disabled
        _disabled={{
          bg: 'gray.200',
          cursor: 'default'
        }}
      >
        {page}
      </Button>
    )
  }
  return (
    <Button
      color="white"
      size="sm"
      fontSize="xs"
      width="4"
      bg="twitter.700"
      _hover={{
        bg: 'twitter.500'
      }}
      onClick={() => onPageChange(page)}
    >
      {page}
    </Button>

  )
}