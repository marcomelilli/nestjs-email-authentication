# Nestjs email authentication
This project is an example of implementation of a user **email authentication** with [Nestjs](https://nestjs.com/) v5.0, [MongoDB](https://www.mongodb.com/) and [PassportJs](http://www.passportjs.org)

It can be used as base of a nestjs project: it implements API for login/registration of a user in a database and features of **email verification**, **forgotten password**, **reset password**, **update profile** and **settings**.

# Getting started
Install `nodejs` and `mongodb` in your machine.

Install dependencies with npm and run the application:
``` 
npm install
npm run start
```

# Configuration File
 You can find a `config.ts` file in the root of the project. Before run the server you have to set :email: [Nodemailer](https://github.com/nodemailer/nodemailer) options to be able to send emails:
```
"host": {
    "url": "<server-url>", //It is needed to redirect user to your server from received email
    "port": "3000"
},
...
"mail":{ 
    "host": "<smtp-host>", //Nodemailer settings (go to the nodemailer documentation for further informations)
    "port": "<port>",
    "secure": false,
    "user": "<username>",
    "pass": "<password>"
}
```

# API
Server will listen on port `3000`, and it expose the following APIs:


- **POST** - `/auth/email/register` - Register a new user
  - **email** - *string*
  - **password** - *string*
  - **name** - *string (optional)*
  - **surname** - *string (optional)*

- **POST** - `/auth/email/login` - Login user
  - **email** - *string*
  - **password** - *string*

- **GET** - `/auth/email/verify/:token` - Activate user account from token sent in the mail

- **GET** - `/auth/email/resend-verification/:email` - Resend verification email with token to user 

- **GET** - `/auth/email/forgot-password/:email` - Send email with token for rest password 

- **POST** - `/auth/email/reset-password` - Change user password
  - **newPassword** - *string*
  - **newPasswordToken** - *string (token received from forgot-password api)*

- **GET** - `/auth/users` - Returns all users (must be logged in)

- **GET** - `/users/user/:email` - Returns selected user info (must be logged in)

- **POST** - `/users/profile/update` - Update user info
  - **name** - *string*
  - **surname** - *string*
  - **phone** - *string*
  - **email** - *string*
  - **birthdaydate** - *Date*
  - **profilepicture** - *string (base64)*

- **POST** - `/users/gallery/update` -  Add/Remove user photos
  - **email** - *string*
  - **action** - *string ('add' or 'remove')*
  - **newPhoto** - *object* (only for case 'add')
    - **imageData** - *string (base64)*
    - **description** - *string*
  - **photoId** - *string (base64)* (only for case 'remove')

- **POST** - `settings/update` - Update user settings
  - **email** - *string*
  - **settingsKey1** - *string (Value1)*
  - **settingsKey2** - *string (Value2)*
  - **...**
  

# Passport JWT strategy
This project use JSON Web Token ([JWT](https://www.npmjs.com/package/passport-jwt)) Bearer Token as authentication strategy for Passport. 
The login API returns an access_token that you have to use to send a correct authorization header in calls that require authentication. You can find an example with postman [here](https://www.getpostman.com/docs/v6/postman/sending_api_requests/authorization)

Login response:
```
{
   ...
  "data": {
      "token": {
          "expires_in": "3600",
          "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...._DkYJJh4s"
      },
  ...
}
```

Authorization header example:
```
 Authorization → Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...._DkYJJh4s
```
# Logger
All request and response are logged so this can help you to debug in production. 
If you use pm2 as process manager, I suggest you to install [pm2-logrotate](https://github.com/keymetrics/pm2-logrotate) in your server.

# Security
The project implements some of nodejs [security techniques](https://docs.nestjs.com/techniques/security) :
- [Helmet](https://github.com/helmetjs/helmet) : can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit): to protect your applications from brute-force attacks
  - In the main.ts you can set a limit of requests in a time window (default is 100 requests in 15 minutes for all endpoints, and 3 requests in a 1 hour for sign up endpoint)

# Copyright
Licensed under the MIT license.
