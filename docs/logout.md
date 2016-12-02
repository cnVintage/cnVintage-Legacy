Logout
======

As the `X-CSRF-Token` in HTTP header is missing, we could not access the logout API of flarum. 
So we just remove `access_token` cookie, together with deleting the access token located in database.
It's not cool, but it works.