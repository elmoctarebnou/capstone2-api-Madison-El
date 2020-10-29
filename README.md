# Spaced Repetition Capstone

## Team:
El Moctar Ebnou
<br/>
Madison Brown
<br/>
Angela Thomas


## Links:
Live Application: https://speak-ez.vercel.app/
<br/>
Client Repo: https://github.com/elmoctarebnou/capstone2-Madison-El-Angela
<br/>
API Repo: https://github.com/elmoctarebnou/capstone2-api-Madison-El-Angela


## Demo Account:

Username: leo
<br/>
Password: Leo12345@

## Endpoints:

## GET /api/language
This endpoint retrieves words from the database.

## GET /api/language/head
This endpoint grabs the head, which points to the next word that will come in the list.

## POST /api/language/guess
This endpoint allows the user to submit their guess for the correct translation and checks it against the answer in the database.
<br/>
Example request body:
<br/>

```
{
    'guess': 'user answer'
}
```

## POST /api/auth/token
This endpoint allows a user to login to their account.
<br/>
Example request body:
<br/>
```
{
    'username':'anyuserUsername'
    'password':'anyuserPassword123'
}
```

## Tech Stack:
Front End: JavaScript, React, HTML5, CSS3
<br/>
Back End: PostgreSQL, Node.js, Express, REST APIs, Mocha & Chai