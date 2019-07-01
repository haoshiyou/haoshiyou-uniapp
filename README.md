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
  - [X] getRelatedUsers

- Room Action
  - [X] Add to HSY Rooms #tested #tested
  - [X] (Safe)-kick from HSY Rooms #tested
  - [X] Blacklist + Extend #tested
  - [X] Kick #tested
  - [X] Make Room Announcement #tested
  - [X] (maybe)Downsize #tested
  - [X] Record invitation #tested
  - [X] Accept Friendship #tested
  - [X] Record Friendship #tested

- Intention Parsing
  - [X] SeekInstruction
  - [X] JoinRoom + which room 
  - [X] PostListing

- Info Extraction
  - [3] Extract Text with haoshiyou-ai
  - [1] Record contact information
  - [X] Download Image, downsample and upload to Cloudinary, Get ID #tested

- Other
 - [3] Downsize friendships? not so soon
 - [X] Use cronjob to post announcement
 - [X] Use npmjs.org/bottleneck to limit rate
 
### UI
- [1] Launch bot from server
- [1] Show QR-code
- [1] Show List
- [1] Show Map
- [1] Show Detail
- [2] Bot status page behind admin

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
        causeContactId: "string",
        degreeOfExtension: "number"
      },
    ],
    friendship: [
      { 
        type:  "Enum<string>",  // {"friend", "unfriend"}
        timestamp: "datetime"
      }
    ]
  },
  
  // ContactMeta
  Contact: {
    _id: "contact.id"
  },
  
  // HsyListing
  HsyListing: {
    _id: "type:contact.id", // e.g. wxId:wxid_wl56wlfbwn512
    imageIds: "string",
    idType: "Enum<string>",  // {wxId, wxNick}
    content: "string",
    title: "string",
    price: "string",
    updated: "datetime",
    status: "Enum<string>", // {active, inactive, deleted}
    location: {
      address: "string",
      zipcode: "string",
      city: "string",
      state: "string",
      lat: "number",
      lng: "number",
    },
  }
}

```
###

```.env
WECHATY_PUPPET_PADPRO_TOKEN=
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_MAP_KEY=
AXIOS_BASE_URL=
```

### Next Generation
  // intent framework
  // message comes in, getting the intent, or collectively getting intent
  // when more intent is getting in emit intent and intent state
  // intent, knowledge, intent related knowledge
