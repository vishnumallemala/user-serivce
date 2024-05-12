# User Management API

## Description

This API provides functionalities for user registration, authentication, and profile management.

## Installation

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/vishnumallemala/user-serivce.git
$ cd user-service
```

To install dependencies, run:

```sh
$ npm ci
```

## Usage

### Serving the app

```sh
$ npm start
```

The application is running on [localhost(Swagger)](http:localhost:3000/api-docs).

## API

1. **POST /register** - Create a new user.
2. **POST /login** - Authenticates the user and returns a jwt token.
3. **GET /profile** - Retrieves the profile of logedin user.
4. **PUT /profile** - Updates the user profile.
5. **GET /profile/allProfiles** - Retrieves all public user profiles if the role is normal use. If role is admin retrieves all the public and private user profiles.
