// HsyListing

export enum HsyGeoAreaEnum {
    南湾东,
    南湾西,
    三番,
    东湾,
    中半岛,
    短租,
    西雅图,
    测试,
}

export enum HsyListingStatusEnum {
  active, inactive, deleted
}

export interface HsyContact {
    _id?:string,
    phone?:string,
    email?:string,
    wxAliasInGroup?:string,
    wxNameOfGroup?:string,
    publicWeChatId?:string,
}

export interface HsyLocation {
    address?:string,
    zipcode?:string,
    city?:string,
    state?:string,
    country?:string,
    lat?:number,
    lng?:number
    hsyGeoAreaEnum?: HsyGeoAreaEnum,
}

export interface  HsyListingInterface {
    _id?:string; // type:contact.id  e.g. "wxId:wxid_wl56wlfbwn512"
    imageIds?:Array<string>,
    content?: string,
    title?: string,
    price?: number,
    created?: Date,
    updated?: Date,
    status?: HsyListingStatusEnum,
    location?: HsyLocation,
    owner?: HsyContact,
    rawHistory?: any,
    rawOriginal?: any,
}
