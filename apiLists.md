# DevTinder APIs

## authRouter

- POST/signup
- POST/login
- POST/logout

## profileRouter

- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password ->forgot password API.

## connectionRequestRouter

<!-- - POST/request/send/intrested/:userID
- POST/request/send/ignore/:userID -->

- POST/request/send/:status/:userId -> this way we can make the above two api as one dynamic api.
- POST/request/review/:status/:requestId

## uaerConnections

- GET /user/requests/received
- GET /user/connections
- GET /user/feed -gets you the profile of the other users on platform.

Status: ignore,intrested,accepted,rejected
