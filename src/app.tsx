import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RouteMap from './RouteMap/RouteMap'

export class Hello extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello World!!!</h1>
                <RouteMap />
            </div>
        );
    }
}

ReactDOM.render(<Hello />, document.getElementById('root'));


