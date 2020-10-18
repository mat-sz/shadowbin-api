import 'reflect-metadata';
import {
  createKoaServer,
  useContainer as useContainerRC,
  Action,
} from 'routing-controllers';
import { createConnection, useContainer as useContainerTO } from 'typeorm';
import { Container } from 'typedi';

import { AuthenticationController } from './controllers/AuthenticationController';
import { PasteController } from './controllers/PasteController';
import { UserController } from './controllers/UserController';

import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { getJWTData, isAuthenticated, hasUserData } from './Authentication';
import { UserService } from './services/UserService';

export default async function App(ormconfig: never) {
  useContainerTO(Container);
  useContainerRC(Container);

  try {
    await createConnection(ormconfig);

    const app = createKoaServer({
      cors: true,
      controllers: [AuthenticationController, PasteController, UserController],
      middlewares: [ErrorMiddleware],
      defaultErrorHandler: false,
      authorizationChecker: async (action: Action, roles: string[]) => {
        const jwtData = getJWTData(action.context);

        if (!isAuthenticated(jwtData)) {
          return false;
        }

        if (roles && roles.length > 0) {
          if (!jwtData.role) {
            return false;
          }

          if (!roles.includes(jwtData.role)) {
            return false;
          }
        }

        return true;
      },
      currentUserChecker: async (action: Action) => {
        const jwtData = getJWTData(action.context);

        if (!hasUserData(jwtData)) {
          return undefined;
        }

        const userService = Container.get(UserService);
        return await userService.byUuid(jwtData.uuid);
      },
    });

    const port = process.env.HTTP_PORT || 8080;
    const ip = process.env.HTTP_IP || '127.0.0.1';
    app.listen(port, ip);

    console.log('shadowbin-api listening on: ' + ip + ':' + port);
  } catch (e) {
    console.error(e);
  }
}
