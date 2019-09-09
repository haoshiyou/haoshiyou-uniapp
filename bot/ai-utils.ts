import {HsyExtractor} from "haoshiyou-ai";
import {HsyContact, HsyListingInterface, HsyLocation} from "../schemas/HsyListingInterface";

export const hsyGroupChatroomIdsToHsyGroupName = {
  "7046190982@chatroom": "测试",  // : "【好室友】测试群",
  "28795198@chatroom": "西雅图",    // : "【好室友】西雅图租房群(试运行)",
  "384195587@chatroom": "短租",   // : "【好室友】短租 - 流动群",
  "348466485@chatroom": "东湾",   // : "【好室友】东湾租房群",
  "1136072@chatroom": "三番",    // : "【好室友】三番租房群旧金山sf城内",
  "544705980@chatroom": "南湾西",   // : "【好室友】南湾西PA-MTV-SV租房群",
  "106702284@chatroom": "南湾东",   // : "【好室友】南湾东 MPTS-SJ租房群",
  "314160598@chatroom": "中半岛",   // : "【好室友】中半岛租房群",
};

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
export let extractFromRawText = async function(rawText:string):Promise<HsyListingInterface> {
  let title = HsyExtractor.extractTitle(rawText);
  let price = parseInt(HsyExtractor.extractPrice(rawText)) || null;
  let fullAddr = HsyExtractor.extractFullAddr(rawText);
  let zipcode = HsyExtractor.extractZipcode(rawText);
  let city = HsyExtractor.extractCity(rawText);
  let phone = HsyExtractor.extractPhone(rawText);
  let wechat = HsyExtractor.extractWeChat(rawText);
  let email = HsyExtractor.extractEmail(rawText);
  if (title === 'N/A' ) title = null;
  if (fullAddr === 'N/A' ) fullAddr = null;
  if (zipcode === 'N/A' ) zipcode = null;
  if (city === 'N/A' ) city = null;
  if (phone === 'N/A' ) phone = null;
  if (wechat === 'N/A' ) wechat = null;
  if (email === 'N/A' ) email = null;
  let geo = null;
  if (fullAddr || zipcode || city) geo = await HsyExtractor.maybeExtractGeoPoint(fullAddr, zipcode, city);
  let location:HsyLocation = {};
  if (geo) {
    location.lng = geo.lng;
    location.lat = geo.lat;
  }
  if (fullAddr) location.address = fullAddr;
  if (city) location.city = city;
  if (zipcode) location.zipcode = zipcode;
  location.country = "USA";
  location.state = "CA";

  let owner: HsyContact = {};
  if (phone) owner.phone = phone;
  if (email) owner.email = email;
  if (wechat) owner.publicWeChatId = wechat;

  let ret:HsyListingInterface = {
    title,
    price,
    content: rawText,
    location: location,
    owner: owner,
  };

  return ret;
};
