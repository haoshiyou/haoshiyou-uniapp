import {HsyExtractor} from "haoshiyou-ai";
import {HsyListingInterface} from "../schemas/HsyListingInterface";

export let ObjFromEntries = function(entries) {
  let obj = {};
  for (let e of entries) {
    obj[e[0]] = e[1];
  }
  return obj;
};

/**
 *
 * @param rawText the message content of a Listing Post
 */
export let fullExtract = async function(rawText:string) {
  let title = HsyExtractor.extractTitle(rawText);
  let price = parseInt(HsyExtractor.extractPrice(rawText)) || 0;
  let fullAddr = HsyExtractor.extractFullAddr(rawText);
  let zipcode = HsyExtractor.extractZipcode(rawText);
  let city = HsyExtractor.extractCity(rawText);
  let phone = HsyExtractor.extractPhone(rawText);
  let wechat = HsyExtractor.extractWeChat(rawText);
  let email = HsyExtractor.extractEmail(rawText);
  if (title === 'N/A' ) title = null;
  if (price === 0 ) price = null;
  if (fullAddr === 'N/A' ) fullAddr = null;
  if (zipcode === 'N/A' ) zipcode = null;
  if (city === 'N/A' ) city = null;
  if (phone === 'N/A' ) phone = null;
  if (wechat === 'N/A' ) wechat = null;
  if (email === 'N/A' ) email = null;
  let geo = await HsyExtractor.maybeExtractGeoPoint(fullAddr, zipcode, city);
  let ret:HsyListingInterface = {
    title,
    price,
    location: {
      zipcode,
      city,
      lat: geo ? geo['lat'] : undefined,
      lng: geo ? geo['lng'] : undefined
    },
    owner: {
      phone,
      publicWeChatId: wechat,
      email,
    },
  };
  return ret;
};
