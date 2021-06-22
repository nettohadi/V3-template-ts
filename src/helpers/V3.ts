import type {RequestType} from "../store/types";
import {getLanguage} from '../helpers/url';

function V3Factory(baseEndpoint: string|null =null,
                   distributor: string|null =null,
                   brandingStyle: string|null =null){
    distributor = distributor || 'TestDistributor';
    baseEndpoint = baseEndpoint || 'https://book.txj.co.jp/v4';

    const serviceEndpoint = `${baseEndpoint}/Services`;
    const pageEndpoint = `${baseEndpoint}/Pages`;

    const endpoints = {
        search: `${serviceEndpoint}/EntityService.jsws/Search`,
        injection: `${serviceEndpoint}/Injection.aspx`,
        searchPage: `${pageEndpoint}/Search.aspx`
    };

    const postJsonData = async function(url: string, request: RequestType, queryString=''){
        const response:any = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).catch((error) => {
            console.error('Error:', error);
        });

        return await response.json();
    };


    const search = async function (request: RequestType) {
        request.ShortName = distributor || '';
        return await postJsonData(endpoints.search,request);
    };

    const redirectToCABS = function (serviceIds = []) {
        const favourites = {
            Favourites: serviceIds
        };

        let formData = [
            {name:'type', value:'SearchInjection'},
            {name:'data', value:JSON.stringify(favourites)},
            {name:'exl_dn', value:distributor},
            {name:'exl_bs', value:brandingStyle},
            {name:'exl_lng', value: getLanguage() + '-JP'},
            // {name:'exl_grp', value:'act'},
            {name:'exl_cur',value:'JPY'}
        ];

        postFormData(endpoints.injection,formData);
    };


    const postFormData = function(url, formData){
        const form = document.createElement("form");
        form.action = url;
        form.method = "POST";

        formData.forEach(function (item) {
            const input = document.createElement("input");
            input.type = 'hidden';
            input.name = item.name;
            input.value = item.value;

            form.appendChild(input);
        });

        document.body.appendChild(form);

        form.submit();

        document.body.removeChild(form)
    };

    return {
        search,
        redirectToCABS
    };
}

export default V3Factory;