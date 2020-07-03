import * as React from 'react';
import { shallow } from 'enzyme';
import RouteMap, { WayPoints } from '../../RouteMap/RouteMap';
import { RouteDrawUtilities, PrevWayPointButton } from '../../RouteMap/RouteDrawUtilities';
import * as L from 'leaflet';

describe('RouteMapTest', () => {

    describe('PrevButtonTest', () => {
        test('PrevButton is active when prevWayPointHistory exist.', () => {
            const routeMap = shallow<RouteMap>(<RouteMap />);
            routeMap.setState({
                clickedPosition: null,
                routingControl: createRouteController(),
                prevWaypointsHistory: waypoints(5),
                nextWaypointsHistory: waypoints(10)
            })
            const routUtilities = routeMap.find(RouteDrawUtilities).dive()
            const prevButton = routUtilities.find(PrevWayPointButton).dive().find('input');
            prevButton.simulate('click');
        
            expect(prevButton.hasClass('disabled')).toBeFalsy();
        });
    
        test('PrevButton is disabled when no prevWayPointHistory exist.', () => {
            const routeMap = shallow<RouteMap>(<RouteMap />);
            routeMap.setState({
                clickedPosition: null,
                routingControl: createRouteController(),
                prevWaypointsHistory: [],
                nextWaypointsHistory: waypoints(10)
            })
            const routUtilities = routeMap.find(RouteDrawUtilities).dive()
            const prevButton = routUtilities.find(PrevWayPointButton).dive().find('input');
            prevButton.simulate('click');
        
            expect(prevButton.hasClass('disabled')).toBeTruthy();
        });
    
        test('Last prevWaypoinHitory size remove last element when prevButton is clicked', () => {
            const routeMap = shallow<RouteMap>(<RouteMap />);
            const prevHistory = waypoints(5);
            routeMap.setState({
                clickedPosition: null,
                routingControl: createRouteController(),
                prevWaypointsHistory: prevHistory,
                nextWaypointsHistory: waypoints(10)
            });
            
            const routUtilities = routeMap.find(RouteDrawUtilities).dive()
            const prevButton = routUtilities.find(PrevWayPointButton).dive().find('input');
            prevButton.simulate('click');
        
            expect(routeMap.state().prevWaypointsHistory.length).toBe(prevHistory.length - 1);
        });
    
        test('Add current waypoint to nextWaypointsHistory when prevButton is clicked', () => {
            const routeMap = shallow<RouteMap>(<RouteMap />);
            const control = createRouteController();
            const next = waypoints(10);
            const currentWaypoint = control.getWaypoints();
            routeMap.setState({
                clickedPosition: null,
                routingControl: control,
                prevWaypointsHistory: waypoints(5),
                nextWaypointsHistory: next
            });
            
            const routUtilities = routeMap.find(RouteDrawUtilities).dive()
            const prevButton = routUtilities.find(PrevWayPointButton).dive().find('input');
            prevButton.simulate('click');
        
            expect(routeMap.state().nextWaypointsHistory.length).toBe(next.length + 1);
            expect(routeMap.state().nextWaypointsHistory[0]).toEqual(currentWaypoint);
        });
    });
    
    function waypoints(size: number): WayPoints[] {
        const result = [] as WayPoints[];
        for (let i = 0; i < size; i++) {
            result.push([
                createWaypoint(i, i + 1),
                createWaypoint(i * 2, i + 2),
                createWaypoint(i * 3, i + 4),
                createWaypoint(1 * 4, i + 54)
            ]);
        }
        return result;
    }
    
    function createWaypoint(lat: number, lng: number) {
        return { latLng: new L.LatLng(lat, lng) } as L.Routing.Waypoint;
    }
    
    function createRouteController() {
        
        return L.Routing.control({
            waypoints: [createWaypoint(1, 1), createWaypoint(2, 2)],
            router: new L.Routing.OSRMv1({
                serviceUrl: `http:localhost/route/v1`,
                profile: 'bike'
            }),
            fitSelectedRoutes: false,
            showAlternatives: false
        });
    }
});
