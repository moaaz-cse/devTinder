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

- POST/request/send/intrested/:userID
- POST/request/send/ignore/:userID
- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestID

- GET /user/connections
- GET /user/requests/received
- GET /user/feed -gets you the profile of the other users on platform.

Status: ignore,intrested,accepted,rejected
