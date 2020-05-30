import './RouteMap.css';
import 'leaflet/dist/leaflet.css';
import { Map as LeafMap, TileLayer } from 'react-leaflet';
import * as React from 'react';
import { LatLng, LeafletMouseEvent, Routing } from 'leaflet';
import { PinValue } from './Pin';
import RoutingLayer from './Routing';
import L = require('leaflet');

interface RouteMapState {
    clickedPosition: L.LatLng | null;
    routingControl: L.Routing.Control | null;
}

export default class RouteMap extends React.Component<{}, RouteMapState> {
    private map: LeafMap | null = null;

    constructor(prop: {}) {
        super(prop);
        this.state = {
            clickedPosition: null,
            routingControl: null
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
                {this.map !== null                    
                    && <RoutingLayer
                        map={this.map}
                        clickedPosition={this.state.clickedPosition}
                        routingControl={this.state.routingControl!} />}
            </LeafMap>
        );
    }

    private saveMap = (map: LeafMap): void => {
        
        this.map = map;

        this.setState({
            routingControl: this.getDefaultControl(this.map.leafletElement, [])
        });
    }

    private handleClick(mouseEvent: LeafletMouseEvent): void {

        if (this.map === null) { return; }

        this.setState({
            clickedPosition: mouseEvent.latlng,
            routingControl: this.state.routingControl
        });
    }

    private getDefaultControl(map: L.Map, waypoints: L.LatLng[]): L.Routing.Control {
        return L.Routing.control({
            waypoints: waypoints,
            router: new L.Routing.OSRMv1({
                serviceUrl: 'http://127.0.0.1:5000/route/v1'
            }),
            lineOptions: {
                styles: [
                    {
                        color: "blue",
                        opacity: 0.6,
                        weight: 4
                    }
                ]
            },
            fitSelectedRoutes: false,
            showAlternatives: false
        }).addTo(map);
    }
}