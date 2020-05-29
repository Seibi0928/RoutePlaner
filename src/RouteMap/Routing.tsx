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
            L.latLng(34, 135),
            L.latLng(139, 49)
        ]);
        return leafletElement.getPlan();
    }
}

export default withLeaflet(RoutingLayer);