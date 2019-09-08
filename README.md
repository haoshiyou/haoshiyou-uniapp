# haoshiyou-uniapp

> a project for haoshiyou uniapp

## Setup

1. `git clone <this repo>`
2. `cd <dir> && npm install` # install
3. create `.env` file with template. See npmjs.org/dotenv for reference.

Ask @xinbenlv for keys.

```
WECHATY_PUPPET_PADPRO_TOKEN=
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_MAP_KEY=
AXIOS_BASE_URL=
# ENABLE_BOT=1

MAIL_USER=
MAIL_PASS=
MAIL_SMTP=

```

4. `npm run dev`
5. open browser with `http://localhost:3000`

## Build Setup

```bash
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

  - [x] isAdmin
  - [x] isWhitelisted
  - [x] isGoodNickname
  - [x] shouldCare
  - [x] isBlacklisted
  - [x] getRelatedUsers

- Room Action

  - [x] Add to HSY Rooms #tested #tested
  - [x] (Safe)-kick from HSY Rooms #tested
  - [x] Blacklist + Extend #tested
  - [x] Kick #tested
  - [x] Make Room Announcement #tested
  - [x] (maybe)Downsize #tested
  - [x] Record invitation #tested
  - [x] Accept Friendship #tested
  - [x] Record Friendship #tested

- Intention Parsing

  - [x] SeekInstruction
  - [x] JoinRoom + which room
  - [x] PostListing

- Info Extraction

  - [3] Extract Text with haoshiyou-ai
  - [1] Record contact information
  - [x] Download Image, downsample and upload to Cloudinary, Get ID #tested

- Other
- [3] Downsize friendships? not so soon
- [x] Use cronjob to post announcement
- [x] Use npmjs.org/bottleneck to limit rate

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
    _id: "message.id"
  },

  // Contact
  ContactMeta: {
    _id: "contact.id",
    isAdmin: "boolean",
    isWhitelisted: "boolean",
    isBlacklisted: "boolean",
    invited: [
      {
        inviteeId: "string",
        timestamp: "datetime",
        roomId: "string"
      }
    ],
    invitedBy: [
      {
        inviterId: "string",
        timestamp: "datetime",
        roomId: "string"
      }
    ],
    blacklistedRecords: [
      {
        adminId: "string",
        timestamp: "datetime",
        direct: "boolean", // true for direct blacklist, false for indirect blacklist (caused by related user being blacklisted)
        causeContactId: "string",
        degreeOfExtension: "number"
      }
    ],
    friendship: [
      {
        type: "Enum<string>", // {"friend", "unfriend"}
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
    _id: "type:contact.id", // e.g. "wxId:wxid_wl56wlfbwn512"
    imageIds: "Array<string>",
    content: "string",
    title: "string",
    price: "number",
    updated: "datetime",
    hsyGeoAreaEnum: "Enum<string>", // was hsyGroupEnum
    status: "Enum<string>", // {active, inactive, deleted}
    location: {
      address: "string",
      zipcode: "string",
      city: "string",
      state: "string",
      country: "string", 
      lat: "number",
      lng: "number"
    },
    owner: {
      phone: "string",
      email: "string",
      wxAliasInGroup: "string",  // “刘德华"
      wxNameOfGroup: "string",  // “南湾西"
      _id: "type:contact.id",  // e.g. "wxId:wxid_wl56wlfbwn512"
    }
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
