import { MapLayer, MapLayerProps, withLeaflet } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Map as LeafMap } from 'react-leaflet';

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
        const { map, clickedPosition, routingControl } = this.props;
        
        if (clickedPosition === null) { return routingControl.getPlan(); }

        const container = L.DomUtil.create('div'),
            startBtn = this.createButton('Start from this location', container),
            destinationBtn = this.createButton('Go to this location', container);

        L.popup()
            .setContent(container)
            .setLatLng(clickedPosition)
            .openOn(map.leafletElement);

        const newWaypoint: L.Routing.Waypoint = {
            latLng: clickedPosition
        }

        L.DomEvent.on(startBtn, 'click', () => {
            routingControl.spliceWaypoints(0, 1, newWaypoint);
            map.leafletElement.closePopup();
        });

        L.DomEvent.on(destinationBtn, 'click', () => {
            routingControl.spliceWaypoints(routingControl.getWaypoints().length - 1, 1, newWaypoint);
            map.leafletElement.closePopup();
        });

        return routingControl.getPlan();
    }

    private createButton(label: string, container: HTMLElement) {
        var btn = L.DomUtil.create('button', '', container);
        btn.setAttribute('type', 'button');
        btn.innerHTML = label;
        return btn;
    }
}

export default withLeaflet(RoutingLayer);