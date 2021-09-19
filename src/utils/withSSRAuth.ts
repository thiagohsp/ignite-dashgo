import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies['dashgo.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (err) {
      console.log('Aqui!', err)
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'dashgo.token')
        destroyCookie(ctx, 'dashgo.refreshToken')
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}