export enum yesNoOption {
    no,
    yes
}

export interface WindowTime {
    StartDate: Date,
    Size: number
}

// export interface  AvailabilityType {
//     MergeMethod:number,
//     Window:WindowTime
// }

export interface BookAbilityType {
    GuestsCapability?: number,
    NightsCapability?: number,
    RateRange?: RangeType
}

export interface RangeType {
    Min: number,
    Max: number,
}

export interface CriteriaType {
    IndustryCategoryGroups?: IndustryCategoryGroups[];
    Id: string | null;
    Availability?: AvailabilityType;
    Bookability?: BookAbilityType;
    Name?:string;
}

export interface CampaignType {
    AdCampaignCode: string,
    DealCampaignCode: string
}

export interface FilterType {
    Ids?: string[]
    Type: string,
    MustBeInAdCampaign: boolean,
    MustBeInDealCampaign: boolean,
    Bookability?: BookAbilityType,
    TagCriteria?: TagCriteriaType,
    Names?:string[]
}

export interface CommonContentType {
    All: boolean
}

export interface AvailabilityType {
    StartDate?: Date,
    NumberOfDays?: number,
    MergeMethod?: number,
    LowestRateOnly?: boolean
    Window?: WindowTime
}

export interface OutputType {
    CommonContent: CommonContentType,
    Availability: AvailabilityType,
    AdvancedContent: boolean
}

export interface PagingType {
    PageNumber: number,
    PageSize: number,
    Token?: string,
    Sorting: SortingBy[]
}

interface SortingBy {
    By: number
}

export interface TagCriteriaType {
    IndustryCategoryGroups: IndustryCategoryGroups[]
}

export interface RequestType {
    ShortName?: string
    Campaign?: CampaignType,
    Availability?: AvailabilityType
    Filter?: FilterType,
    Language: string,
    Output: OutputType,
    Paging: PagingType
}

export interface GeocodeType {
    latitude: number,
    longitude: number
}

export enum IndustryCategoryGroups {
    accommodation,
    activity,
    epicurean
}

export interface ServiceType {
    Id?: string,
    Name?: string,
    Thumbnail?: string,
    Images?: string[],
    Desc?: string,
    LongDesc?: string,
    Price?: number,
    Phone?: string,
    Fax?: string,
    Website?: string,
    PublicEmail?: string,
    Address?: string,
    Geocode?: GeocodeType,
    Type?: IndustryCategoryGroups,
    TypeName?: string
}

export interface MyTripType {
    Id?: string,
    Name?: string,
    Thumbnail?: string,
    Desc?: string,
    Price?: number,
    Type?: IndustryCategoryGroups
}

export interface ProductActions {
    remove: Function
}

export interface WishListType {
    Id?: string,
    Name?: string,
    Thumbnail?: string,
    Desc?: string,
    Price?: number,
    Type?: IndustryCategoryGroups
}