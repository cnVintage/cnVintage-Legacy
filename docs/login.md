Login
=====

After login, flaurm will generate an access token and save it in both server database and client cookie.
So it's easy to implement the login handler: 

1. receive a form from client.
2. convert the form to JSON, and POST it to flaurm API.
3. check the response. If access token included, set up cookie and send 301 to redirect client to index.

#### Login without browser:

cURL command (Captured by Chrome DevTools):
``` bash
curl 'http://www.cnvintage.lo/login' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  --data-binary '{"identification":"<USERNAME>","password":"<USERPASS>"}'
```