import { MapLayer, MapLayerProps, withLeaflet } from 'react-leaflet';
import * as L from 'leaflet'
import 'leaflet-routing-machine';
import { Map as LeafMap } from 'react-leaflet';

class RoutingLayer extends MapLayer<{ map: LeafMap } & MapLayerProps, L.Layer> {
    public createLeafletElement(_: unknown): L.Layer {
        const { map } = this.props;
        let leafletElement = L.Routing.control({
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
        }).addTo(map.leafletElement)
        .setWaypoints([
            L.latLng(16.506, 80.648),
            L.latLng(17.384, 78.4866),
            L.latLng(12.971, 77.5945)
        ]);
        return leafletElement.getPlan();
    }
}

export default withLeaflet(RoutingLayer);