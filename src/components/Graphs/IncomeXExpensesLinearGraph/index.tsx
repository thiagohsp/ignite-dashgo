
import { theme, Box, Text, Heading } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

const colorPalette = ['#00D8B6','#FF4560','#008FFB',  '#FEB019', '#775DD0']

interface IncomeXExpensesLinearGraphProps {
  data: { [key: string]: { income?: number, expense?: number } }
}

const IncomeXExpensesLinearGraph = ({ data }: IncomeXExpensesLinearGraphProps) => {

  const options: ApexOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: theme.colors.gray[500]
    },
    grid: { show: false },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
    xaxis: {
      type: "datetime",
      axisBorder: { color: theme.colors.gray[500] },
      axisTicks: { color: theme.colors.gray[500] },
      categories: data ? Object.keys(data) : [] 
    },
    colors: colorPalette,
    fill: {
      opacity: 0.3,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    }
  };

  const [ series, setSeries ] = useState<ApexAxisChartSeries>([]);

  useEffect(() => {
    if (data) {
      setSeries([
        { name: 'Entradas', data: Object.values(data).map((item: any) => Math.round(item.income / 1000)) },
        { name: 'Saídas', data: Object.values(data).map((item: any) => Math.round(item.expense / 1000)) }
      ]);
    }
  }, [data])

  return (
  
    <Box
      bg="white"
      borderRadius={8}
      //pb="4"
    >
      <Heading size="md" mb="4">Receitas x Despesas</Heading>
      <Chart options={options} series={series} type="area"  />
    </Box>

  );
}

export default IncomeXExpensesLinearGraph;