declare const google: any;
declare const MarkerWithLabel: any;
declare const MarkerClusterer: any;

import wishlist from "../store/wishlist";
import type {ServiceType} from '../store/types';

let Map: any;

const center = {lat: 40.204824, lng: 141.49455}

export function createMap(elementId: string, zoom = 3): any {
    const mapOptions = {
        streetViewControl: false,
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center,
        disableDefaultUI: true
    };

    Map = new google.maps.Map(document.getElementById(elementId), mapOptions);

    markerClusterer = new MarkerClusterer(Map, markers, {
        imagePath: ""
    });
}

let markers: any[] = [];
let markerClusterer: any;

export function resetMarkers() {

    markers.forEach((item) => {
        item.setMap(null)
        // markerClusterer.removeMarker(item);
    });
    markers = [];

    markerClusterer.clearMarkers();

}

export function createMarker(service: ServiceType, moveCenter = false): void {
    const noImage = 'https://digitalfinger.id/wp-content/uploads/2019/12/no-image-available-icon-6-600x375.png';
    const markerClass = {
        0: 'fas fa-hotel',
        1: 'fas fa-skiing',
        2: 'fas fa-utensils',
        3: 'fas fa-shopping-basket'
    };

    const markerCard = `<div class="markerz-container" id="${service.Id}">
                            <div class="markerz-card"><i class="${markerClass[service.Type]}"></i></div>
                            <div class="markerz-arrow">T</div>
                        </div>`;

    const marker = new MarkerWithLabel({
        position: new google.maps.LatLng(service.Geocode?.latitude ?? center.lat, service.Geocode?.longitude ?? center.lng),
        clickable: true,
        draggable: false,
        map: Map,
        optimized: false,
        labelContent: markerCard,
        labelAnchor: new google.maps.Point(-20, -50),
        labelClass: "markerLabels", // the CSS class for the label
        labelStyle: {opacity: 1.0},
        icon: '',
        zIndex: 1
    });

    marker.addListener('mouseover', function () {
        document.getElementById(service.Id).classList.add('rotate');
    });
    marker.addListener('mouseout', function () {
        document.getElementById(service.Id).classList.remove('rotate')
    });

    if (moveCenter) {
        Map.panTo(marker.getPosition());
    }

    const imageBackground =
        `background:linear-gradient(to bottom, #00000052 40%, rgba(0 0 0 / 85%)), url('${service.Thumbnail}');`;

    const infoWindow = `
        <div class="info-window">
            <div class="info-image relative" style="${imageBackground}">
            <div class="name-address name-address-map">
                <div class="col-1" style="width: 85%">
                    <div class="name two-liner">${service.Name}</div>
                    <div class="address two-liner">${service.Address}</div>
                </div>
            <div class="col-2" style="width: 15%">
                <div class="wishlist-button fa fa-heart"  id="like-${service.Id}"></div>
            </div>
    </div>
        </div>
            <div class="info-row"> Not Rated Yet</div>
        </div>
    `;

    const infowindow = new google.maps.InfoWindow({
        content: infoWindow
    });


    const like = function () {
        wishlist.add(service);
        isAlreadyLiked();
    };

    const isAlreadyLiked = () => {
        const button  = document.getElementById('like-' + service.Id);
        if(wishlist.alreadyExist(service.Id)){
            button.classList.add('liked');
        }else{
            button.classList.remove('liked');
        }
    }

    marker.addListener('click', function () {
        infowindow.open(Map, marker);

        setTimeout(function (){
            const likeButton  = document.getElementById('like-' + service.Id);
            likeButton.removeEventListener('click', like);
            likeButton.addEventListener('click',like);
            isAlreadyLiked();
        }, 200)

    });

    //



    // const index = markers.findIndex((marker) => marker.id == service.Id);
    // if (index != -1) {
    //     //replace the existing
    //     // markers[index] = {id: service.Id, self: marker, open, close};
    // } else {
    //     //push to the stack
    //     // markers.push({id: service.Id, self: marker, open, close});
    //     // markers.push(marker);
    // }

    markers.push(marker);

    markerClusterer.addMarker(marker);
}

