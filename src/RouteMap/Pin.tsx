import * as React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';

export interface PinValue {
    key: number;
    pos: LatLng;
}

export function Pin(content: PinValue): JSX.Element {

    return (
        <Marker key={content.key} position={content.pos} >
            <Popup>‚¤‚¢‚Á‚·</Popup>
        </Marker>
    );
}