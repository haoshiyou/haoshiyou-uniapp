import {extractFromRawText, ObjFromEntries} from "./ai-utils";

require(`dotenv`).config();
import {Db, MongoClient} from "mongodb";

async function main() {
  let client:MongoClient = await MongoClient.connect(process.env.MONGODB_URI);
  const mongodb:Db = client.db(process.env.MONGODB_URI.split('/')[-1]);
  let result = await mongodb.collection(`HsyListing`).find({"content" : {"$exists" : true, "$ne" : ""}}).toArray();
  //console.log(`${JSON.stringify(result,null, 2)}`);
  result.forEach(async (hsyListing) => {
    let _id = hsyListing._id;
    let extracted = await extractFromRawText(hsyListing.content);
    extracted._id = _id;
    extracted.owner._id = _id;
    console.log(`Start extract _id=${_id} ${JSON.stringify(extracted)}`);
    await mongodb.collection(`HsyListing`).findOneAndUpdate(
        {_id: extracted._id},
        {
          $set: ObjFromEntries(Object.entries(extracted).filter(([k,v]) => v !== null)),
          $unset: ObjFromEntries(Object.entries(extracted).filter(([k,v]) => v === null)),
        },
        {upsert:false});

    console.log(`Done extract _id=${_id} ${JSON.stringify(extracted)}`);
  });

}

main();
