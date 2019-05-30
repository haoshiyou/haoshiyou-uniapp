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
  - [X] isAdmin
  - [X] isWhitelisted
  - [X] isGoodNickname
  - [X] shouldCare
  - [X] isBlacklisted
  - [ ] getRelatedUsers

- Room Action
  - [X] Add to HSY Rooms
  - [X] (Safe)-kick from HSY Rooms
  - [1] Blacklist + Kick + Extend Kick
  - [1] Make Room Announcement
  - [X] (maybe)Downsize
  - [1] Record invitation
  - [1] Accept Friendship
  - [1] Record Friendship
  - [2] Automatic Remove Friendship?

- Intention Parsing
  - [X] SeekInstruction
  - [X] JoinRoom + which room 
  - [ ] PostListing

- Other
 - [ ] Downsize friendships? not so soon
 - [ ] Use cronjob to post announcement
 - [X] Use npmjs.org/bottleneck to limit rate

## MongoDB schema
```json5
{
  // Message
  Message: {
    _id: "message.id"
  },
  // MessageMeta
  MessageMeta: {
    _id: "message.id",
  },
  
  // Contact
  ContactMeta: {
    _id: "contact.id",
    isAdmin: "boolean",
    isWhitelisted: "boolean",
    isBlacklisted: "boolean",
    invited: [{
      inviteeId: "string", 
      timestamp: "datetime", 
      roomId: "string" 
    }],
    invitedBy: [{
      inviterId: "string", 
      timestamp: "datetime", 
      roomId: "string" 
    }],
    blacklistedRecords: [
      { 
        adminId: "string",
        timestamp: "datetime",
        direct: "boolean", // true for direct blacklist, false for indirect blacklist (caused by related user being blacklisted)
        causeRelatedUserId: "string",
        degreeOfExtension: "number"
      },
    ]
  },
  
  // ContactMeta
  Contact: {
    _id: "contact.id"
  }
}

```


### Next Generation
  // intent framework
  // message comes in, getting the intent, or collectively getting intent
  // when more intent is getting in emit intent and intent state
  // intent, knowledge, intent related knowledge
