New Discussion
==============

#### Create a new discussion in cURL:

cURL command (Captured by Chrome DevTools):
``` bash
curl 'http://www.cnvintage.lo/api/discussions' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -H 'Cookie: flarum_remember=<ACCESS_TOKEN>' \
  --data-binary '<JSON STRING>'
```

And the `<JSON STRING>` part should be:

``` JavaScript
JSON.stringify({
  data: {
    type: 'discussions',
    attributes: {
      title: "<TITLE>", 'content':"<CONTENT>"
    },
    relationships:{
      tags: {
        data: [
          { type:"tags", id:"8" }
        ]
      }
    }
  }
})
```
