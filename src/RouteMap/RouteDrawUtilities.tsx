import * as React from 'react';
import * as L from 'leaflet';
import './RouteDrawUtilities.scss';
import { WayPoints } from './RouteMap';

interface RouteDrawUtilitiesProp {
    routingControl: L.Routing.Control | null;
    prevWaypointsHistory: WayPoints[];
    nextWaypointsHistory: WayPoints[];
    prevClick: () => void;
    nextClick: () => void;
    clearClick: () => void;
}

export class RouteDrawUtilities extends React.Component<RouteDrawUtilitiesProp, {}> {

    render(): JSX.Element {
        return (
            <div className="route-draw-utilities">
                <NextWayPointsButton routeMap={this.props} />
                <PrevWayPointButton routeMap={this.props} />
                <ClearWayPointsButton routeMap={this.props} />
            </div>
        );
    }
}

const commonClassName = 'waypoint-operate-button';

export function PrevWayPointButton(props: { routeMap: RouteDrawUtilitiesProp }): JSX.Element {

    return (
        <div className={commonClassName}>
            <input
                id="prevButton"
                type="button"
                onClick={() => props.routeMap.prevClick()}
                value="Prev"
                title="Prev"
                className={(props.routeMap.prevWaypointsHistory.length > 0 ? '' : 'disabled')} />
        </div>
    );
}

export function NextWayPointsButton(props: { routeMap: RouteDrawUtilitiesProp }): JSX.Element {

    return (
        <div className={commonClassName}>
            <input
                type="button"
                onClick={() => props.routeMap.nextClick()}
                value="Next"
                title="Next"
                className={(props.routeMap.nextWaypointsHistory.length > 0 ? '' : 'disabled')} />
        </div>
    );
}

export function ClearWayPointsButton(props: { routeMap: RouteDrawUtilitiesProp }): JSX.Element {

    const currentWayPoint = props.routeMap.routingControl?.getWaypoints() ?? [];

    return (
        <div className={commonClassName}>
            <input
                type="button"
                onClick={() => props.routeMap.clearClick()}
                value="Clear"
                title="Clear"
            />
        </div>
    );
}