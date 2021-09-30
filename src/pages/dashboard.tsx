import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import dynamic from 'next/dynamic'
import { parseCookies } from "nookies";
import { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";


const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

const colorPalette = ['#00D8B6','#FF4560','#008FFB',  '#FEB019', '#775DD0']

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


export default function Dashboard({dashboards}) {

  const series = [
    { name: 'incomes', data: Object.values(dashboards).map((item: any) => item.income) },
    { name: 'expenses', data: Object.values(dashboards).map((item: any) => item.expense) },
  ]

  options.xaxis.categories = Object.keys(dashboards);

  return (
    <Flex direction="column" h="100vh">

      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
          <Box
            p={["6", "8"]}
            bg="white"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Receitas x Despesas</Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>

          <Box
            p={["6", "8"]}
            bg="white"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Receitas x Despesas</Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>
          
        </SimpleGrid>
      </Flex>
    </Flex>

  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx: GetServerSidePropsContext) => {
  
  const api = setupAPIClient(ctx);

  const { data } = await api.get('dashboard');

  return {
    props: {
      dashboards: data
    },
  };
});

// export const getServerSideProps = withSSRAuth(async (ctx) => {

//   const api = setupAPIClient(ctx)
//   const dashboards = await api.get('/dashboards');

//   console.log(dashboards)

//   return {
//     props: {
//       dashboards
//     }
//   }
// });