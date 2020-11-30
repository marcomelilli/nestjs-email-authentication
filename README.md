# Nestjs email authentication starter
This project is an example of implementation of a user **email authentication** with [Nestjs](https://nestjs.com/) v6.9.0, [MongoDB](https://www.mongodb.com/) and [PassportJs](http://www.passportjs.org)

It can be used as starter for a new project: it implements API for user sign-in/sign-up and features like **email verification**, **forgotten password**, **reset password**, **update profile** and **settings**.

# Getting started
Install `nodejs` and `mongodb` in your machine.

Install dependencies with npm and run the application:
``` 
npm install
npm run start
```

# Deploy using Docker
⚠️ Before deploy the app in a container set the right **configuration** as explained in the section below, and then you can run:
``` 
docker-compose up -d
```
It will generate 3 containers: 
- nestjs: nodejs application -> localhost:3000 (you can change the port in the docker-compose.yml)
- mongodb: database -> expose 27017 in the container network but not reacheable from outside.
- mongo-express: a web-based MongoDB admin interface -> localhost:8081

You can edit the config is in `docker-compose.yml`.  
❗ Note: For security reason, remember to **change the db password** in docker-compose.yml and in config.ts file, and to **change the mongo-express password** to access the console.


# Configuration File
You can find a `config.ts` file in the root of the project.   
Before run the server set your **db configuration** (according you are using docker or not) and your :email: [Nodemailer](https://github.com/nodemailer/nodemailer) options to be able to send emails for registration:
```
# Docker Example #
"db": {
    "user": "root",
    "pass": "example",
    "host": "mongo",
    "port": "27017",
    "database": "testdb", 
    "authSource": "admin"
}

# Local nodejs Example #
"db": {
   "user": null,
   "pass": null,
   "host": "localhost",
   "port": "27017",
   "database": "testdb",
   "authSource": null
}

...  

"host": {
    "url": "<server-url>",  //This link is used to redirect users to your server to confirm their email address (link via email)
    "port": "3000"
},

...

"mail":{ 
    "host": "<smtp-host>", //Nodemailer settings (go to the nodemailer documentation for further informations) - You need to set up this to make the signup api start working
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

- **GET** - `/auth/email/verify/:token` - Validates the token sent in the email and activates the user's account

- **GET** - `/auth/email/resend-verification/:email` - Resend verification email

- **GET** - `/auth/email/forgot-password/:email` - Send a token via email to reset the password 

- **POST** - `/auth/email/reset-password` - Change user password
  - **newPassword** - *string*
  - **newPasswordToken** - *string (token received by forgot-password api)*

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

# Contributing
If you want to contribute to this starter, consider:

- Reporting bugs and errors
- Improve the documentation
- Creating new features and pull requests

<a href="https://www.buymeacoffee.com/marcomelilli"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=marcomelilli&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"></a>

All contributions are welcome!

# Copyright
Licensed under the MIT license.
