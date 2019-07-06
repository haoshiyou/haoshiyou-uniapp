import {HsyExtractor} from "haoshiyou-ai";

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
  let price = HsyExtractor.extractPrice(rawText);
  let fullAddr = HsyExtractor.extractFullAddr(rawText);
  let zipcode = HsyExtractor.extractZipcode(rawText);
  let city = HsyExtractor.extractCity(rawText);
  let phone = HsyExtractor.extractPhone(rawText);
  let wechat = HsyExtractor.extractWeChat(rawText);
  let email = HsyExtractor.extractEmail(rawText);
  if (title === 'N/A' ) title = null;
  if (price === 'N/A' ) price = null;
  if (fullAddr === 'N/A' ) fullAddr = null;
  if (zipcode === 'N/A' ) zipcode = null;
  if (city === 'N/A' ) price = null;
  if (phone === 'N/A' ) phone = null;
  if (wechat === 'N/A' ) wechat = null;
  if (email === 'N/A' ) email = null;
  let geo = await HsyExtractor.maybeExtractGeoPoint(fullAddr, zipcode, city);
  return {
    title,
    price,
    fullAddr,
    zipcode,
    city,
    phone,
    wechat,
    email,
    geo
  }
};
