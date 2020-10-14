# shadowbin-api

API for Shadowbin.

## Installation

Run `yarn install`, `yarn build` and then simply run `yarn start`. For development you can also run shadowbin-api with live reload, `yarn dev`.

## Configuration

`dotenv-flow` is used to manage the configuration.

The following variables are used for the configuration:

| Variable        | Default value | Description                                 |
| --------------- | ------------- | ------------------------------------------- |
| `HTTP_IP`       | `127.0.0.1`   | IP address to bind to.                      |
| `HTTP_PORT`     | `8080`        | Port to bind to.                            |
| `JWT_SECRET`    | undefined     | JWT signature secret.                       |
| `JWT_EXPIRY`    | `7200`        | Expiration time of JWT tokens (in seconds). |
| `BCRYPT_ROUNDS` | `12`          | Number of rounds used for Bcrypt.           |
| `PASTE_EXPIRY`  | `30`          | Default expiration of pastes (in days).     |
