# haoshiyou-uniapp

> a project for haoshiyou uniapp

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Features
### Bot
- Utils - utility methods to be used
  - [ ] isAdmin
  - [ ] isWhitelisted
  - [ ] isGoodNickname
  - [ ] shouldCare
  - [ ] isBlacklisted

- Room Action
  - [X] Add to HSY Rooms
  - [ ] (Safe)-kick from HSY Rooms
  - [ ] Blacklist + Kick + Extend Kick
  - [ ] Make Room Announcement
  - [ ] (maybe)Downsize
  - [ ] Record invitation

- Intention Parsing
  - [X] SeekInstruction
  - [X] JoinRoom + which room 
  - [ ] PostListing

- Other
 - [ ] Downsize friendships? not so soon
 - [ ] Use cronjob to post announcement
 - [ ] Use npmjs.org/bottleneck to limit rate

## MongoDB schema
```json5
// Message
{
  _id: "message.id"
},
// MessageMeta
{
  _id: "message.id"
},

// Contact
{
  _id: "contact.id"
}

// ContactMeta
{
  _id: "contact.id"
}
```


### Next Generation
  // intent framework
  // message comes in, getting the intent, or collectively getting intent
  // when more intent is getting in emit intent and intent state
  // intent, knowledge, intent related knowledge
