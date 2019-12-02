# mcbbs-news-parser
A small software used to get news from "https://www.mcbbs.net/forum-news-1.html", with rest apis.

# How To Use

> Install

```
  npm install
```

> Build

```
  npm run build
```

> Configuration

```
  cd build/
  vim(vi) ./config.json
```

> Run (In Production Mode)

```
  node ./index.js Or npm run run
```

> Configuration File Description

***It is important to modify the config.json***

+ checkInterval: News check interval, in millisecond.
+ pageCount: How many pages you want to fetch.
+ port: Server port

# How To Get News Using Rest API?
> I provided two routes to get the result from the program

+ "http://[ADDRESS]:[PORT]/rest/api/news/": This is the default route to get the news, by default, it will return 20 news.
+ "http://[ADDRESS]:[PORT]/rest/api/news/:count": This api has a custom parameter "count", you can specify how many news you want to get one time.
