# express-post-redirect

Express middleware for server side redirection post `POST` request

## Effects

With middleware installed, inside the response object of a `POST` route will have a `finalize(data)` function. This should be used instead of `response.send()` at the end of the route. `response.finalize(data)` will then send a server-side-redirect if a `redirect` query exists in the request, otherwise will send the data in the `data` parameter.

## Installation

Requires express to be installed.

1. Run in CLI `npm install express-post-redirect`

2. In javascript write:

```javascript
const express = require('express');
const app = express();

app.use(require('express-post-redirect'));
```

## Usage

### In javascript:

```javascript
// Any generic post route
app.post('/post/route/here', (req, res) => {
    //... Do something

    res.finalize('Thank you for using express-post-redirect'); //<-- Uses the middleware
});
```

### In HTTP request:

With no query yields:

```http
HTTP/1.1 200
status: 200
x-powered-by: Express
content-type: text/plain; charset=utf-8
connection: keep-alive
Thank you for using express-post-redirect'
```

With query yields:

```http
HTTP/1.1 302
status: 302
x-powered-by: Express
location: REDIRECTQUERYHERE
vary: Accept
content-type: text/plain; charset=utf-8
content-length: 32
date: Sun, 17 Jun 2018 22:19:20 GMT
connection: keep-alive
Found. Redirecting to index.html
```


Ripped from my [personal-git](https://github.com/danhab99/personal-git/blob/master/middleware/post-redirect.js) project.
