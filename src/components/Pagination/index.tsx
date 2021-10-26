import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import PaginationItem from "./PaginationItem";

interface PaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const siblingCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return (from + index + 1)
    }).filter(page => page > 0);
}

export default function Pagination({
  totalCountOfRegisters,
  currentPage = 1,
  registersPerPage = 10,
  onPageChange
}: PaginationProps) {


  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage);

  const previousPages = currentPage > 1
    ? generatePagesArray(currentPage - siblingCount - 1, currentPage - 1)
    : [];

  const nextPages = currentPage < lastPage
    ? generatePagesArray(currentPage, Math.min(currentPage + siblingCount, lastPage))
    : [];

  return (
    <Stack
      direction={["column", "row"]}
      spacing="6"
      align="center"
      mt="8"
      justify="space-between"
    >
      <Box>
        <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
      </Box>

      <HStack spacing="2">

        {currentPage > (1 + siblingCount) &&
          <>
            <PaginationItem onPageChange={onPageChange} page={1} />
            {currentPage > (2 + siblingCount) && (
              <Text color="gray.300" w={8} textAlign="center">...</Text>
            )}
          </>
        }

        {previousPages.length > 0 && previousPages.map(page =>
          <PaginationItem onPageChange={onPageChange} page={page} key={page}/>
        )}

        <PaginationItem onPageChange={onPageChange} page={currentPage} isCurrent />

        {nextPages.length > 0 && nextPages.map(page =>
          <PaginationItem onPageChange={onPageChange} page={page} key={page} />
        )}

        {(currentPage + siblingCount) < (lastPage) &&
          <>
            {(currentPage + 1 + siblingCount) < lastPage && (
              <Text color="gray.300" w={8} textAlign="center">...</Text>
            )}
            <PaginationItem onPageChange={onPageChange} page={lastPage} />
          </>
        }

      </HStack>

    </Stack>
  )
}