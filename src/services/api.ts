import { destroyCookie, parseCookies, setCookie } from 'nookies';
import axios, { AxiosError } from "axios";
import { AuthTokenError } from '../errors/AuthTokenError';

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined) {

  let cookies = parseCookies(ctx);

  console.log(cookies)

  const api = axios.create({
    baseURL: 'http://localhost:3333/',
    headers: {
      Authorization: `Bearer ${cookies['dashgo.token']}`
    }
  });

  // api.interceptors.response.use(
  //   (success) => success,
  //   (error: AxiosError) => {

  //     if (error.response.status === 401) {

  //       // if (error.response.data?.code === 'token.expired') {

  //       //   cookies = parseCookies(ctx);

  //       //   const { 'dashgo.refreshToken': refreshToken } = cookies;

  //       //   const originalConfig = error.config;

  //       //   if (!isRefreshing) {

  //       //     isRefreshing = true;

  //       //     api.post('/refresh', {
  //       //       refreshToken
  //       //     }).then((response) => {
  //       //       const { token } = response.data;
  //       //       setCookie(ctx, 'dashgo.token', token, {
  //       //         maxAge: 60 * 60 * 24 * 30, // 30 dias
  //       //         path: '/'
  //       //       });
  //       //       setCookie(ctx, 'dashgo.refreshToken', response.data.refreshToken, {
  //       //         maxAge: 60 * 60 * 24 * 30, // 30 dias
  //       //         path: '/'
  //       //       });

  //       //       api.defaults.headers['Authorization'] = `Bearer ${token}`

  //       //       failedRequestsQueue.forEach((request) => request.onSuccess(token));
  //       //       failedRequestsQueue = [];

  //       //     }).catch((err) => {
  //       //       failedRequestsQueue.forEach((request) => request.onFailure(err));
  //       //       failedRequestsQueue = [];
  //       //     }).finally(() => {
  //       //       isRefreshing = false;
  //       //     })

  //       //   }

  //       //   return new Promise((resolve, reject) => {
  //       //     failedRequestsQueue.push({
  //       //       onSuccess: (token: string) => {
  //       //         originalConfig.headers['Authorization'] = `Bearer ${token}`
  //       //         resolve(api(originalConfig))
  //       //       },
  //       //       onFailure: (err) => {
  //       //         reject(err)
  //       //       }
  //       //     })
  //       //   })
  //       // } else {
  //         // deslogar
  //         if (process.browser) {
  //           destroyCookie(ctx,'dashgo.token');
  //         } else
  //           return Promise.reject(new AuthTokenError())
  //       // }

  //       return Promise.reject(error)
  //     }
  //   }
  // );

  return api;
}