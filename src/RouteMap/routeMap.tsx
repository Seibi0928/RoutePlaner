import './RouteMap.css';
import 'leaflet/dist/leaflet.css';
import { Map as LeafMap, Popup, TileLayer } from 'react-leaflet';
import * as React from 'react';
import { LatLng, LeafletMouseEvent } from 'leaflet';
import { PinValue, Pin } from './Pin';

interface RouteMapState {
    pins: PinValue[]
}

export default class RouteMap extends React.Component<{}, RouteMapState> {
    private mockKey = 1;
    constructor(prop: { }) {
        super(prop);
        this.state = { pins: [] };
    }

    render() {
        const pos = new LatLng(35, 139);
        return (
            <LeafMap center={pos} zoom={13}
                onclick={e => this.handleClick(e)}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
                {this.state.pins.map(p => <Pin key={p.key} pos={p.pos} />)}
            </LeafMap>
        );
    }

    private handleClick(mouseEvent: LeafletMouseEvent): void {

        const pins = this.state.pins.slice();
        pins.push({ key: this.mockKey++, pos: mouseEvent.latlng });
        this.setState({ pins });
    }
}