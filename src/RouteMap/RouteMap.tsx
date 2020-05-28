import './RouteMap.css';
import 'leaflet/dist/leaflet.css';
import { Map as LeafMap, TileLayer } from 'react-leaflet';
import * as React from 'react';
import { LatLng, LeafletMouseEvent, Routing } from 'leaflet';
import { PinValue } from './Pin';
import RoutingLayer from './Routing';

interface RouteMapState {
    pins: PinValue[];
    isMapInit: boolean;
}

export default class RouteMap extends React.Component<{}, RouteMapState> {
    private mockKey = 1;
    private map: LeafMap;

    constructor(prop: { }) {
        super(prop);
        this.state = {
            pins: [], isMapInit: false
        };
    }

    render() {
        const pos = new LatLng(35, 139);
        return (
            <LeafMap center={pos} zoom={13}
                ref={this.saveMap}
                onclick={e => this.handleClick(e)}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
                {/* {this.state.pins.map(p => <Pin key={p.key} pos={p.pos} />)} */}
                {this.state.isMapInit && <RoutingLayer map={this.map} />}
            </LeafMap>
        );
    }

    private saveMap = (map: LeafMap): void => {
        this.map = map;
        this.setState({
            pins: this.state.pins,
            isMapInit: true
        });
    }

    private handleClick(mouseEvent: LeafletMouseEvent): void {

        const pins = this.state.pins.slice();
        pins.push({ key: this.mockKey++, pos: mouseEvent.latlng });
        this.setState({ pins });
    }
}