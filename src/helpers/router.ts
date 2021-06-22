import {getUrlParam} from '../helpers/url'
import Services from '../pages/services/Index.svelte';
import Service from '../pages/service/index.svelte';

function getPage(name: string) {
    let pages = {services: Services, service: Service};
    return pages[name.toLowerCase()];
}

export function route() {
    let page = getUrlParam('page') || 'Services';
    return getPage(page);
}