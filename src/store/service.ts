import {writable} from 'svelte/store';
import {getLanguage} from '../helpers/url';
import {isDefinedNotNull} from '../helpers/common';
import V3Factory from '../helpers/V3';
import type {ServiceType, CriteriaType, yesNoOption, AvailabilityType, RequestType} from "./types";
import {noImage} from './sharedState';

const serviceStore = writable([]);
const isLoading = writable(false);
const serviceCount = writable(0);


const V3 = V3Factory('https://book.txj.co.jp/v4', 'HachimantaiDMO2021', 'HachimantaiDMO2021');

let pageNumber = 0;
let pagingToken = '';
let cachedCriteria: CriteriaType;


function withComma(value: string) {
    if (value) {
        return `, ${value}`;
    }

    return '';
}

function cacheCriteria(criteria: CriteriaType | null): CriteriaType | null {
    if (criteria) {
        cachedCriteria = criteria;
    } else {
        criteria = cachedCriteria;
    }
    return criteria;
}

function getRequest(criteria: CriteriaType | null, getNextPage = false) {
    const defaultAvailability: AvailabilityType = {
        MergeMethod: 1,
        Window: {
            StartDate: new Date(),
            Size: 42
        }
    };

    const language = `${(getLanguage() || 'ja')}-JP`;

    let request: RequestType =
        {
            Language: `${language}`,
            Output: {
                CommonContent: {
                    All: true
                },
                Availability: {
                    StartDate: new Date(),
                    NumberOfDays: 42,
                    MergeMethod: 2,
                    LowestRateOnly: true
                },
                AdvancedContent: true
            },
            Paging: {
                PageNumber: pageNumber,
                PageSize: 6,
                Sorting: [{By: 0}]
            }
        };

    if (getNextPage) {
        request.Paging.Token = pagingToken;
    } else {
        request = {
            ...request,
            Filter: {
                Type: "Service",
                MustBeInAdCampaign: true,
                MustBeInDealCampaign: false
            },
            Campaign: {
                AdCampaignCode: "",
                DealCampaignCode: ""
            }
        }
    }

    //return early;
    if (!criteria) return request;

    if (criteria.Id) {
        request.Filter.Ids = [criteria.Id];
    } else {


        if (!getNextPage) {
            request.Availability = criteria.Availability || defaultAvailability;
        }

        if (isDefinedNotNull(criteria.Bookability) && !getNextPage) {
            request.Filter.Bookability = criteria.Bookability;
        }

        if (isDefinedNotNull(criteria.IndustryCategoryGroups) && !getNextPage) {
            request.Filter.TagCriteria = {IndustryCategoryGroups: criteria.IndustryCategoryGroups};
        }

        if (isDefinedNotNull(criteria.Name) && !getNextPage) {
            request.Filter.Names = ['%' + criteria.Name + '%']
        }
    }

    return request;
}

async function search(criteria: CriteriaType | null = null, getNextPage = false) {

    criteria = cacheCriteria(criteria);

    if (!getNextPage) {
        //empty store
        serviceStore.set([]);
        pageNumber = 0;
    }

    isLoading.set(true);

    //increment page number
    pageNumber++;

    const response = await V3.search(getRequest(criteria, getNextPage));

    const services = prepare(response.Entities);
    serviceCount.set(response.Paging.NumberOfResults);

    if (getNextPage) {
        //concatenate services
        serviceStore.update((value) => {
            return [...value, ...services];
        });

    } else {
        //replace services
        serviceStore.set(services);
        //set paging token
        pagingToken = response.Paging.Token;
    }

    isLoading.set(false);
}

function prepare(services: any): ServiceType[] {
    return services.map(function (service: any, index: number): ServiceType {
        return {
            Id: service.Id,
            Name: service.Name,
            Thumbnail: service.Images && service.Images.length ?
                service.Images[0].Url : noImage,
            Images: service.Images && service.Images.length ?
                service.Images.map((img: any) => img.Url) : null,
            Desc: service.ShortDescription || service.LongDescription.substr(0, 200) + ' ...',
            LongDesc: service.LongDescription,
            Price: Math.round(service.Availability.Calendar.LowestRate),
            Phone: service.MainPhone.FullPhoneNumberLocalised,
            Fax: service.Facsimile || '00-00-00',
            Website: service.Website || 'No Public Website',
            PublicEmail: service.PublicEmail,
            Address: service.PhysicalAddress.Line1 +
                withComma(service.PhysicalAddress.Line2) +
                withComma(service.PhysicalAddress.City) +
                withComma(service.PhysicalAddress.PostCode),
            Geocode: {
                latitude: service.HasGeocodes ? service.Geocodes[0].Geocode.Latitude : 51.4921 + (index * 0.5),
                longitude: service.HasGeocodes ? service.Geocodes[0].Geocode.Longitude : 0.17924 + (index * 0.5)
            },
            Type: service.IndustryCategoryGroups[0],
            TypeName: getTypeName(service.IndustryCategoryGroups[0])
        }
    });
}

function getTypeName(type: number): string {
    let name = '';
    switch (type) {
        case 0:
            name = 'Accommodation';
            break;
        case 1:
            name = 'Activity';
            break
        case 2:
            name = 'Restaurant';
            break;
        case 3:
            name = 'Produce';
            break;
        default:
            name = 'Accommodation';
    }

    return name;
}


function getNextPage() {
    search(null, true);
}

let store;
export default store = {
    search,
    getNextPage,
    data: {
        subscribe: serviceStore.subscribe,
        isLoading: {subscribe: isLoading.subscribe},
        count: {subscribe: serviceCount.subscribe}
    }
};



