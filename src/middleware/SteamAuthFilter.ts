// import
//
// @Catch(InternalOpenIDError)
// export class SteamAuthFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const status = exception.getStatus();
//
//     response.status(status).redirect('/admins');
//   }
// }
