import * as React from 'react';
import * as L from 'leaflet';
import './RouteDrawUtilities.scss';

interface RouteDrawUtilitiesProp {
    routingControl: L.Routing.Control | null;
}

export default class RouteDrawUtilities extends React.Component<RouteDrawUtilitiesProp, {}> {

    render(): JSX.Element {
        return (
            <div className="route-draw-utilities">
                <RemoveWayPointButton routingControl={this.props.routingControl} />
            </div>
        );
    }
}

function RemoveWayPointButton(props: { routingControl: L.Routing.Control | null }): JSX.Element {

    const handleClick = () => {
        if (props.routingControl === null) { return; }

        const currentWaypoints = props.routingControl.getWaypoints();
        currentWaypoints.pop();
        props.routingControl.setWaypoints(currentWaypoints);
    };

    return (
        <div className="waypoint-remove-button">
            <input
                type="button"
                onClick={() => handleClick()}
                value="Remove Latest Waypoint"
                title="Remove Latest Waypoint" />
        </div>
    );
}