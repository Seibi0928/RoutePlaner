import './RouteMap.scss';
import 'leaflet/dist/leaflet.css';
import { Map as LeafMap, TileLayer } from 'react-leaflet';
import * as React from 'react';
import { LatLng, LeafletMouseEvent } from 'leaflet';
import RoutingLayer from './Routing';
import L = require('leaflet');
import RouteDrawUtilities from './RouteDrawUtilities';

export type WayPoints = L.Routing.Waypoint[];

interface RouteMapState {
    clickedPosition: L.LatLng | null;
    routingControl: L.Routing.Control | null;
    prevWaypointsHistory: WayPoints[];
    nextWaypointsHistory: WayPoints[];
}

export default class RouteMap extends React.Component<{}, RouteMapState> {
    private map: LeafMap | null = null;

    constructor(prop: {}) {
        super(prop);
        this.state = {
            clickedPosition: null,
            routingControl: null,
            prevWaypointsHistory: [],
            nextWaypointsHistory: []
        };
    }

    render() {
        const pos = new LatLng(35, 139);
        return (
            <div>
                <RouteDrawUtilities
                    routingControl={this.state.routingControl}
                    prevWaypointsHistory={this.state.prevWaypointsHistory}
                    nextWaypointsHistory={this.state.nextWaypointsHistory}
                    prevClick={() => this.handlePrevClick()}
                    nextClick={() => this.handleNextClick()}
                    clearClick={() => this.handleClearClick()}
                />
                <LeafMap center={pos} zoom={13}
                    ref={this.saveMap}
                    onclick={e => this.handleClick(e)}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
                    {this.map !== null
                        && this.state.routingControl !== null
                        && <RoutingLayer
                            map={this.map}
                            clickedPosition={this.state.clickedPosition}
                            routingControl={this.state.routingControl}
                            prevWayPointsHistory={this.state.prevWaypointsHistory}
                            gotoButtonClick={() => this.handleGotoButtonClick()} />}
                </LeafMap>
            </div>
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
            routingControl: this.state.routingControl,
            clickedPosition: mouseEvent.latlng
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

    private handleGotoButtonClick() {
         this.setState({
            routingControl: this.state.routingControl,
            nextWaypointsHistory: []
        });
    }

    private handlePrevClick() {

        const currentControl = this.state.routingControl;

        if (currentControl === null) { return; }

        const prevHistorySize = this.state.prevWaypointsHistory.length;

        if (prevHistorySize <= 0) { return; }

        this.setState({
            clickedPosition: null,
            nextWaypointsHistory: [currentControl.getWaypoints()].concat(this.state.nextWaypointsHistory),
            prevWaypointsHistory: this.state.prevWaypointsHistory.slice(0, prevHistorySize - 1)
        });

        currentControl.setWaypoints(this.state.prevWaypointsHistory[prevHistorySize - 1]);
    }

    private handleNextClick() {

        const currentControl = this.state.routingControl;

        if (currentControl === null) { return; }

        if (this.state.nextWaypointsHistory.length <= 0) { return; }

        this.setState({
            clickedPosition: null,
            nextWaypointsHistory: this.state.nextWaypointsHistory.slice(1),
            prevWaypointsHistory: this.state.prevWaypointsHistory.concat([currentControl.getWaypoints()])
        });

        currentControl.setWaypoints(this.state.nextWaypointsHistory[0]);
    }

    handleClearClick(): void {

        let toBePrevHistory = this.state.prevWaypointsHistory;
        if (this.state.routingControl?.getWaypoints()) {
            toBePrevHistory = toBePrevHistory.concat([this.state.routingControl.getWaypoints()]);
        }

        this.state.routingControl?.setWaypoints([]);
        this.setState({
            routingControl: this.state.routingControl,
            clickedPosition: null,
            nextWaypointsHistory: [],
            prevWaypointsHistory: toBePrevHistory
        });
    }
}
