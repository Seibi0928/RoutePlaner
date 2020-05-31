import { MapLayer, MapLayerProps, withLeaflet } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Map as LeafMap } from 'react-leaflet';
import './Routing.scss';

type RoutingLayerProp = {
    map: LeafMap,
    clickedPosition: L.LatLng | null,
    routingControl: L.Routing.Control
} & MapLayerProps;

class RoutingLayer extends MapLayer<RoutingLayerProp, L.Layer> {

    public createLeafletElement(_: unknown): L.Layer {
        const { routingControl } = this.props;

        if (routingControl === null) { throw new Error('routing control is not initialized.'); }

        return routingControl.getPlan();
    }

    public updateLeafletElement(_: unknown, prop: RoutingLayerProp) {
        const { clickedPosition, routingControl } = this.props;

        if (clickedPosition === null) { return routingControl.getPlan(); }

        const newWaypoint: L.Routing.Waypoint = { latLng: clickedPosition };

        if (RoutingLayer.wayPointsIsInitialState(routingControl.getWaypoints())) {
            this.setStartPopup(clickedPosition, newWaypoint);
        } else {
            this.setGotoPopup(clickedPosition, newWaypoint);
        }

        return routingControl.getPlan();
    }

    // よくわからないけどwaypointsの初期値にはlatLngがundefinedな要素が入っている
    // TODO: githubのソースコード確認する
    private static wayPointsIsInitialState(waypoints: L.Routing.Waypoint[]): boolean {
        return waypoints.every(w => !w.latLng);
    }

    private static isNotSetDestinationPoint(waypoints: L.Routing.Waypoint[]): boolean {
        return waypoints.some(x => !x.latLng);
    }

    private setGotoPopup(clickedPosition: L.LatLng, newWaypoint: L.Routing.Waypoint) {

        const { map, routingControl } = this.props;

        const container = L.DomUtil.create('div');
        const popOption: L.PopupOptions = { minWidth: 169 };

        RoutingLayer.openPopup(popOption, container, clickedPosition, map.leafletElement);

        const gotoBtn = RoutingLayer.createButton('Go to this location', container);

        L.DomEvent.on(gotoBtn, 'click', () => {
            if (RoutingLayer.isNotSetDestinationPoint(routingControl.getWaypoints())) {
                const waypointsSize = routingControl.getWaypoints().length;
                routingControl.spliceWaypoints(waypointsSize - 1, 1, newWaypoint);
            } else {
                const prevWayPoints = routingControl.getWaypoints();
                routingControl.setWaypoints(prevWayPoints.concat([newWaypoint]));
            }
            map.leafletElement.closePopup();
        });
    }

    private setStartPopup(clickedPosition: L.LatLng, newWaypoint: L.Routing.Waypoint) {

        const { map, routingControl } = this.props;

        const container = L.DomUtil.create('div');
        const popOption: L.PopupOptions = { minWidth: 212 };

        RoutingLayer.openPopup(popOption, container, clickedPosition, map.leafletElement);

        const startBtn = RoutingLayer.createButton('Start from this location', container);

        L.DomEvent.on(startBtn, 'click', () => {
            routingControl.spliceWaypoints(0, 1, newWaypoint);
            map.leafletElement.closePopup();
        });
    }

    private static openPopup(popOption: L.PopupOptions, container: HTMLElement, clickedPosition: L.LatLng, leafLetMap: L.Map) {
        L.popup(popOption)
            .setContent(container)
            .setLatLng(clickedPosition)
            .openOn(leafLetMap);
    }

    private static createButton(label: string, container: HTMLElement) {
        var btn = L.DomUtil.create('button', '', container);
        btn.setAttribute('type', 'button');
        btn.innerHTML = label;
        return btn;
    }
}

export default withLeaflet(RoutingLayer);