import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import { GetServerSideProps } from "next";
import dynamic from 'next/dynamic'
import { parseCookies } from "nookies";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";


const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

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
    axisBorder: { color: theme.colors.gray[600] },
    axisTicks: { color: theme.colors.gray[600] },
    categories: [
      '2021-05-12T00:00:00.000Z',
      '2021-05-13T00:00:00.000Z',
      '2021-05-14T00:00:00.000Z',
      '2021-05-15T00:00:00.000Z',
      '2021-05-16T00:00:00.000Z',
      '2021-05-17T00:00:00.000Z',
      '2021-05-18T00:00:00.000Z',
    ]
  },
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

const series = [
  { name: 'S1', data: [10, 20, 35, 21, 48, 9, 3] }
];


export default function Dashboard() {


  return (
    <Flex direction="column" h="100vh">

      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
          <Box
            p={["6", "8"]}
            bg="purple.800"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Novos Usuários da Semana</Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>

          <Box
            p={["6", "8"]}
            bg="purple.800"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Taxa de conversão</Text>
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>

  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
});