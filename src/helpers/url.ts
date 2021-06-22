import type {CriteriaType} from "../store/types";
import {isDefinedNotNull, isDefinedNotNullNotEmpty} from "./common";

export function getUrlParam(name = '', url = ''): string | null {
    if (!url) url = window.location.href;

    name = name.replace(/[\[\]]/g, '\\$&');

    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getLanguage(paramName = 'lang'): string {
    return getUrlParam(paramName) || 'ja';
}

export function getDetailsUrl(id) {
    let  lang = getLanguage();
    let focus = getUrlParam('focus') ? '&focus=1' : '';
    let type = getUrlParam('type');
    type = type ? `&type=${type}` : '';

    lang = lang ? `lang=${lang}&` : '';
    return `index.html?${lang}page=details&id=${id}${type}${focus}`;
}

export function getListUrl({type, name, price}:any | null) {
    let  lang = getLanguage();
    lang = lang ? `lang=${lang}` : '';

    type = isDefinedNotNullNotEmpty(type) ? `&type=${type}` : '';
    name = name ? `&name=${name}` : '';
    price = price ? `&price=${price}` : '';

    let focus = getUrlParam('focus') ? '&focus=1' : '';

    return `index.html?${lang}${type + name + price + focus}`;
}