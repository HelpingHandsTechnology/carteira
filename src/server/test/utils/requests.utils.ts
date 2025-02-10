// import { INestApplication } from '@nestjs/common';
// kkV
// import { SuperAgentRequest } from 'superagent';
// import request from 'supertest';
// import TestAgent from 'supertest/lib/agent';

// type GetRequest = (req: TestAgent) => SuperAgentRequest;

// export async function withAdminSession(
//   app: INestApplication,
//   getRequest: GetRequest,
// ): Promise<SuperAgentRequest> {
//   const sessionId = await getSessionId(app, 'admin');
//   const req = request(app.getHttpServer());
//   return getRequest(req).set('cookie', `connect.sid=${sessionId}`);
// }

// export async function withUserSession(
//   app: INestApplication,
//   getRequest: GetRequest,
//   username = 'john.doe',
// ): Promise<SuperAgentRequest> {
//   const sessionId = await getSessionId(app, username);
//   const req = request(app.getHttpServer());
//   return getRequest(req).set('cookie', `connect.sid=${sessionId}`);
// }

// export async function getSessionId(
//   app: INestApplication,
//   username: string,
//   password = 'password',
// ) {
//   const loginResponse = await request(app.getHttpServer())
//     .post('/auth/login')
//     .send({ username, password });

//   const sessionCookie = loginResponse.headers['set-cookie'][0];
//   const sessionCookieRegex =
//     /^connect.sid=(.*); Path=\/; Expires=.*; HttpOnly$/;

//   return sessionCookieRegex.exec(sessionCookie)![1];
// }
