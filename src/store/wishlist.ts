import {writable,derived} from "svelte/store";
import V3Factory from '../helpers/V3';
import type {ServiceType} from "./types";

const V3 = V3Factory('https://book.txj.co.jp/v4', 'HachimantaiDMO2021', 'HachimantaiDMO2021');

const wishlist = writable([]);
const count = derived(wishlist, $wishlist => $wishlist.length);
const ids = derived(wishlist, $wishlist => $wishlist.map(item => item.Id));
const visible = writable(false);
const no_image = 'https://digitalfinger.id/wp-content/uploads/2019/12/no-image-available-icon-6-600x375.png';


function add(service:ServiceType) {
    wishlist.update(value => {
        if(alreadyExist(service.Id)){
            value.splice(findIndex(value, service.Id),1);
        }else{
            value.push(prepare(service));
        }

        persistToLocalStorage(value);
        runSideEffects(service);

        return value;
    });
}

function runSideEffects(service:ServiceType){
    const button  = document.getElementById('like-' + service.Id);
    if(alreadyExist(service.Id)){
        button?.classList.remove('liked');
    }else{
        button?.classList.add('liked');
    }
}
function prepare({Id, Name, Thumbnail, Desc, Price}:any) {
    return {Id, Name, Thumbnail, Desc, Price};
}

function remove(service) {
    wishlist.update(value => {
        value.splice(findIndex(value, service.Id),1);
        persistToLocalStorage(value);
        return value;
    });
}

function findIndex(array,id=null) {
    return array.findIndex((item) => item.Id === id);
}


function init() {
    let savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.set(savedWishlist);
}

function persistToLocalStorage(wishlist) {
    wishlist = JSON.stringify(wishlist);
    localStorage.setItem('wishlist',wishlist);
}

function show(){
    visible.set(true);
}

function hide(){
    visible.set(false);
}

function goToCABS(){
    let favourites = [];
    const unsubscribe = ids.subscribe(value => favourites = value);
    unsubscribe();

    V3.redirectToCABS(favourites);
}

function alreadyExist(id:string){
    let idArray = [];
    const unsub = ids.subscribe((value) => idArray = value );
    const _isExist = idArray.includes(id);
    unsub();
    return _isExist;
}

let store;
export default store  = {
    subscribe:wishlist.subscribe,
    init,
    add,
    remove,
    show,
    hide,
    goToCABS,
    count,
    visible: {subscribe:visible.subscribe},
    ids,
    alreadyExist
};