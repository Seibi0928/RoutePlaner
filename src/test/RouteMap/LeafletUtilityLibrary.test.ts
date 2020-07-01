import LeafLetUtilityLibrary from '../../RouteMap/LeafletUtilityLibrary';
import * as L from 'leaflet';

describe('LeafletUtilityLibraryTest', () => {
    test('should discriminate waypoints which is initialized.', () => {

        const unsetPoint = { latLng: new L.LatLng(1, 1) } as L.Routing.Waypoint;
        unsetPoint.latLng = (null) as any;
        const initailWaypoints = [unsetPoint, unsetPoint] as L.Routing.Waypoint[]; 
        expect(LeafLetUtilityLibrary.wayPointsIsInitialState(initailWaypoints)).toBeTruthy();
    
        const start = { latLng: new L.LatLng(1, 1) } as L.Routing.Waypoint;
        const noDestinationPoints = [start, unsetPoint];
        expect(LeafLetUtilityLibrary.wayPointsIsInitialState(noDestinationPoints)).toBeFalsy();
    
        const end = { latLng: new L.LatLng(2, 2) } as L.Routing.Waypoint;
        const waypointsWhenSetBothStartPointAndEndPoint = [start, end];
        expect(LeafLetUtilityLibrary.wayPointsIsInitialState(waypointsWhenSetBothStartPointAndEndPoint)).toBeFalsy();
    });
    
    test('should discriminate when no destination points are set.', () => {
        
        const unsetPoint = { latLng: new L.LatLng(1, 1) } as L.Routing.Waypoint;
        unsetPoint.latLng = (null) as any;
        
        const start = { latLng: new L.LatLng(1, 1) } as L.Routing.Waypoint;
        const noDestinationPoints = [start, unsetPoint];
        expect(LeafLetUtilityLibrary.isNotSetDestinationPoint(noDestinationPoints)).toBeTruthy();
    
        const initailWaypoints = [unsetPoint, unsetPoint];
        expect(LeafLetUtilityLibrary.wayPointsIsInitialState(initailWaypoints)).toBeTruthy(); 
    
        const end = { latLng: new L.LatLng(2, 2) } as L.Routing.Waypoint;
        const waypointsWhenSetBothStartPointAndEndPoint = [start, end];
        expect(LeafLetUtilityLibrary.wayPointsIsInitialState(waypointsWhenSetBothStartPointAndEndPoint)).toBeFalsy();
    });
});
