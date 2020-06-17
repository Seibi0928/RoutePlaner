import * as L from 'leaflet';

export default class LeafLetUtilityLibrary {
    // よくわからないけどwaypointsの初期値にはlatLngがundefinedな要素が入っている
    // TODO: githubのソースコード確認する
    public static wayPointsIsInitialState(waypoints: L.Routing.Waypoint[]): boolean {
        return waypoints.every(w => !w.latLng);
    }

    public static isNotSetDestinationPoint(waypoints: L.Routing.Waypoint[]): boolean {
        return waypoints.some(x => !x.latLng);
    }
}