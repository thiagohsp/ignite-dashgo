import { Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { differenceInCalendarDays, format, isAfter, parse } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table'


type CategoryTotal = {
  grupo: string;
  categoria: string;
  total: number;
  mes: string;
}

interface CategoriesTotalsTableProps {
  data: CategoryTotal[]
} 


const CategoriesTotalsTable = ({ data }: CategoriesTotalsTableProps ) => {

  const result = useMemo(() => {
    const gruposCategorias = Array.from(new Set(data.map(item => `${item.grupo}:${item.categoria}`))).sort((a,b) => a > b ? 1 : -1); 
    const mapped = gruposCategorias.map((item) => {
      const monthValues = data.filter((filtered) => filtered.grupo === item.split(':')[0] && filtered.categoria === item.split(':')[1] )
      const sumTotal = monthValues.reduce((acc, curr) => { 
        return { 
          total: acc.total + curr.total
        } 
      }, { total: 0 })
      const res = {
        grupo: item.split(':')[0],
        categoria: item.split(':')[1]
      }
      monthValues.sort((a, b) => a.mes > b.mes ? 1 : -1).forEach((month) => {
        Object.assign(res, { [month.mes]: month.total })
      })

      Object.assign(res, sumTotal)

      return res;
    }) 

    return mapped
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Grupo',
        accessor: 'grupo',
      },
      {
        Header: 'Categoria',
        accessor: 'categoria',
      },
      {
        Header: 'Janeiro',
        accessor: '01/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Fevereiro',
        accessor: '02/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Março',
        accessor: '03/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Abril',
        accessor: '04/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Maio',
        accessor: '05/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Junho',
        accessor: '06/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Julho',
        accessor: '07/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Agosto',
        accessor: '08/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Setembro',
        accessor: '09/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Outubro',
        accessor: '10/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Novembro',
        accessor: '11/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Dezembro',
        accessor: '12/2021',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      },
      {
        Header: 'Total',
        accessor: 'total',
        Cell: (props) => { return <Text textAlign="right">{Number(props.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> }
      }
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: result,
  })

  return (
    <Table {...getTableProps()} variant="striped" colorScheme="blue" border="1px">
      <Thead>
        {headerGroups.map(headerGroup => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <Td fontSize="xs" {...cell.getCellProps()} >{cell.render('Cell')}</Td>
              })}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export default CategoriesTotalsTable;