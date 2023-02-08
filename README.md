# README Template

[![License](https://img.shields.io/github/license/zakwht/goodreads)](/LICENSE.md)
[![Example](https://img.shields.io/badge/vercel-deployed-black)](#)
[![Version](https://img.shields.io/github/package-json/v/zakwht/goodreads)](#)

An Express API that computes a Goodreads user's current book, returning either JSON or SVG.

The program parses the most recent relevant update in a user's RSS feed to output summarized information. The API is powered by Express, Nunjucks, and Vercel.

### Development

#### Requirements
- Node v18+ (built with 18.13.0)

#### Scripts
`start`: starts the API in watch mode, on `localhost:3000`
`deploy`: publishes a production version of the API to vercel

### Usage

Take the numerical user ID from Goodreads, _e.g._ `139946054` from `https://www.goodreads.com/user/show/139946054-zak`

```markdown
### Currently Reading
[![Goodreads](https://goodreads-six.vercel.app/goodreads/json?user=139946054)](https://www.goodreads.com/user/show/139946054-zak)
```

#### Currently Reading
[![Example](https://goodreads-six.vercel.app/goodreads?user=jonsnow)](https://www.goodreads.com/user/show/139946054-zak)

Alternatively, the API has a JSON endpoint:

```shell
curl "https://goodreads-six.vercel.app/goodreads/json?user=139946054"
```
```json
{
  "author": {
    "link": "https://www.goodreads.com/author/show/2783704.Matthew_Gabriele",
    "name": "Matthew Gabriele"
  },
  "book": {
    "image": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1617197593l/57355365._SY216_.jpg",
    "title": "The Bright Ages: A New History of Medieval Europe",
    "author": "Matthew Gabriele",
    "link": "https://www.goodreads.com/book/show/57355365-the-bright-ages"
  },
  "pages": {
    "read": 224,
    "total": 307
  },
  "update": {
    "date": "2022-12-27T20:12:34.000Z",
    "link": "https://www.goodreads.com/review/show/5194135600"
  },
  "profile": {
    "name": "Gabriel",
    "link": "https://www.goodreads.com/user/show/134428078-gabriel"
  }
}
```
Schema - response properties vary based on type of RSS item:
```TypeScript
book: { title, author, image, link? },
update: { date, link? }, # corresponding Goodreads update
profile: { name, link }, # user profile
author?: { link, name },
pages?: { read, total },
progress? # a number representing percentage of book read
```

### Acknowledgments
- __Consumes the__ [Goodreads](https://www.goodreads.com/) user RSS feeds