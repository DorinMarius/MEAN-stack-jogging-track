# Toptal Technical Interview 2

## Spec: Write an application that tracks jogging times of users

- User must be able to create an account and log in
  (If a mobile application, this means that more users can use the app from the same phone)

- When logged in, user can see, edit and delete his times he entered

- Implement at least two roles with different permission levels
  (ie: a regular user would only be able to CRUD on his owned records,
  a user manager would be able to CRUD users,
  an admin would be able to CRUD on all records and users, etc.)

- Each time entry when entered has a date, distance, and time

- When displayed, each time entry has an average speed

- Filter by dates from-to

- Report on average speed & distance per week

- REST API.
  Make it possible to perform all user actions via the API,
  including authentication
  (If a mobile application and you don’t know how to create your own
  backend you can use Parse.com, Firebase.com or similar services to create the API).

- In any case you should be able to explain how a
  REST API works and demonstrate that by creating
  functional tests that use the REST Layer directly.

- All actions need to be done client side using AJAX,
  refreshing the page is not acceptable. (If a mobile app, disregard this)

- Bonus: unit and e2e tests!

- You will not be marked on graphic design, however, do try to keep it as tidy as possible.

## Before Dev/Run

- install loopback globally
- install webpack globally
- `npm install`

## Dev

TODO

## Before Deploy

TODO

## Run

TODO

## TODO

- Implement at least two roles with different permission levels
  (ie: a regular user would only be able to CRUD on his owned records,
  a user manager would be able to CRUD users,
  an admin would be able to CRUD on all records and users, etc.)

  - get current user role after login
  - display users page if current user is admin or manager
    - C
    - R
    - U
    - D
  - display any user record page if current user is admin

  - admin page
    - assign user manager
    - all jog function for every user
  - user manager page
    - user management

- In any case you should be able to explain how a                           -- 2 (do while dev)
  REST API works and demonstrate that by creating
  functional tests that use the REST Layer directly.

  - user jog record
    - CRUD
    - ACL

- Bonus: unit and e2e tests!

## TODO: Bonus

- unit tests (do while dev)
- e2e tests 5
- Dockerize it
- mobile: React Native - same time as web

- web minor
  - session form enter to login/signup
  - improve error handle
    - email duplicate error
