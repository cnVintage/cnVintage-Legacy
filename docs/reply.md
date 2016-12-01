Reply
=====

#### Reply to a discussion without browser:

cURL command (Captured by Chrome DevTools):
``` bash
curl '<ORIG URL>/api/posts' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -H 'Cookie: flarum_remember=<ACCESS_TOKEN>' \
  --data-binary '<JSON STRING>'
```

And the `<JSON STRING>` part should be:
``` JavaScript
JSON.stringify({
  data: {
    type: "posts",
    attributes: {
      content: "<CONTENT>"
    },
    relationships: {
      discussion: {
        data: {
          type: "discussions",
          id: <PARENT ID>
        }
      }
    }
  }
})
```
