
const Parser = require("rss-parser");

const GR_URL = 'https://www.goodreads.com'
const RSS_URL = 'https://www.goodreads.com/user/updates_rss/'

// https://regexr.com/77nti
const REGEX = /(?:is currently reading|is on page \d+ of \d+ of|started reading|is \d+% done with) ('?)(.+)\1/

const clean_ws = str => str.replace(/\n\s+/g,' ').trim()//.replace(/\n    /g,'')
const clean_entity = str => str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"')

const parse_content = (content, bookTitle) => {
  content = clean_entity(clean_ws(content)).replace(/href="/g, `href="${GR_URL}`).replace(/_SY\d+/,"_SY216").replace(/_SX\d+/,"_SX144")
  const [, imgSrc] = content.match(/<img [^>]*src="([^"]*)"/)
  const author = content.match(/alt="[^"]*by ([^"]*)"/)[1];
  const book = { image: imgSrc, title: bookTitle, author } 
  if (/<a [^>]* class="authorName" href="([^"]*)">([^<>]*)<\/a>/.test(content)) {
    const [, authorLink, authorName] = content.match(/<a [^>]* class="authorName" href="([^"]*)">([^<>]*)<\/a>/)
    const [, bookLink] = content.match(/<a [^>]*class="bookTitle" href="([^"]*)">[^<>]*<\/a>/)
    return { author: {link: authorLink, name: authorName}, book: {...book, link: bookLink}}
  } else if (/is on page (\d+) of (\d+)/.test(content)) {
    // const authorName = content.match(/alt="[^"]*by ([^"]*)"/)[1];
    const [, progPages, totalPages] = content.match(/is on page (\d+) of (\d+)/);
    return { book, pages: { read: progPages, total: totalPages }}
  } else if (/is (\d+)% done/.test(content)) {
    const progress = content.match(/is (\d+)% done/)[1]
    return { book, progress }
  }return { book }
}

const getProgress = res => {
  if (res.progress) return `${res.progress}%`
  else if (res.pages) return `${res.pages.read}/${res.pages.total}`
  return ""
}

const getRSS = userID => {
  const parser = new Parser();
  return parser.parseURL(RSS_URL + userID)
}

const parse = userID => {
  return getRSS(userID).then(feed => {
    for (const item of feed.items) {
      const title = clean_ws(item.title);
      if (REGEX.test(title)) {
        const [,, book] = title.match(REGEX)
       return {
          ...parse_content(item.content, book),
          update: { date: item.isoDate, link: item.link },
          profile: { name: feed.description.slice(20), link: feed.link }
        }
      }
    } return {
      profile: { name: feed.description.slice(20), link: feed.link }
    }
  }).catch(error => ({ error }))
}

module.exports = { getProgress, parse, getRSS }


// explain algo: finds most recent match only!
// edge case: you finished and reviewed a book without startign a new one , it's still "current"
// review link will either be review or if progress update, profile link


// https://www.goodreads.com/user/updates_rss/57158879
// example for % completion ^^
// https://github.com/JBornman/JBornman/blob/main/README.md
// here is a lovely visual!