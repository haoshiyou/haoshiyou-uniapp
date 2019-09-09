import {HsyContact, HsyGeoAreaEnum, HsyLocation} from "./HsyListingInterface";
import {Db, MongoClient} from "mongodb";
import {hsyGroupChatroomIdsToHsyGroupName} from "../bot/ai-utils";

require(`dotenv`).config();

async function main() {
    let client:MongoClient = await MongoClient.connect(process.env.MONGODB_URI);
    const mongodb:Db = client.db(process.env.MONGODB_URI.split('/')[-1]);
    console.log(`DB`, process.env.MONGODB_URI.split('/')[-1]);
    let result = await mongodb.collection(`NewHsyListing`).find({"content" : {"$exists" : true, "$ne" : ""}}).toArray();
    // console.log(result);

    await Promise.all(result.map(async hsyListing => {
        for (let k of Object.keys(hsyListing)) {
            if (hsyListing[k] == "N/A") delete hsyListing[k];
        }
        let location:HsyLocation = {
            state: "CA",
            country: "USA"
        };

        if (hsyListing.rawHistory) {
            let roomId:string = hsyListing.rawHistory[hsyListing.rawHistory.length - 1].roomId;
            let hsyGeoAreaEnum:HsyGeoAreaEnum = hsyGroupChatroomIdsToHsyGroupName[roomId];
            location.hsyGeoAreaEnum = hsyGeoAreaEnum;
            if (location.hsyGeoAreaEnum == HsyGeoAreaEnum.西雅图) location.state = "WA";
            else if (location.hsyGeoAreaEnum == HsyGeoAreaEnum.测试) location.state = "CA"
        }

        if (hsyListing.city) location.city = hsyListing.city;
        if (hsyListing.fullAddr) location.address = hsyListing.fullAddr;
        if (hsyListing.zipcode) location.zipcode = hsyListing.zipcode;

        if (hsyListing.geo) {
            location.lat = hsyListing.geo.lat;
            location.lng = hsyListing.geo.lng;
        }
        delete hsyListing.city;
        delete hsyListing.fullAddr;
        delete hsyListing.geo;
        delete hsyListing.zipcode;
        hsyListing.location = location;

        if (typeof hsyListing.imageIds == "string") {
            hsyListing.imageIds = [hsyListing.imageIds ]
        } else if (Array.isArray(hsyListing.imageIds)) {
            hsyListing.imageIds = [...new Set(hsyListing.imageIds)];
        }

        let owner:HsyContact = {
            _id: hsyListing._id,
        };
        if (hsyListing.phone) owner.phone = hsyListing.phone;
        if (hsyListing.wechat) owner.publicWeChatId = hsyListing.wechat;
        if (hsyListing.email) owner.email = hsyListing.email;

        delete hsyListing.phone;
        delete hsyListing.wechat;
        delete hsyListing.email;
        hsyListing.owner = owner;
        console.log(`Start extract _id=${hsyListing._id}`);
        console.log(hsyListing);
        await mongodb.collection(`NewHsyListing`).replaceOne(
            {_id: hsyListing._id},
            hsyListing);
        console.log(`Done extract _id=${hsyListing._id}`);
        return;
    }));

    console.log(`Done done done!`);
}

main();
