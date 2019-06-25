import * as React from 'react';

interface Props {}

interface State {
    started_at: number;
    elapsed: number;
}

class Timer extends React.Component<Props, State> {

    state = {
        started_at: Date.now() / 1000,
        elapsed: 0
    };

    // tslint:disable-next-line:no-any
    private timer: any;
    
    componentDidMount() {
        this.timer = setInterval( () => this.tick(), 50);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    hhmmss(str: string) {
        const val = parseInt( str, 10 );
        var hours: number|string   = Math.floor(val / 3600);
        var minutes: number|string = Math.floor((val - (hours * 3600)) / 60);
        var seconds: number|string = val - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) { hours   = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }
        return hours + ':' + minutes + ':' + seconds;
    }

    tick() {
        this.setState( {
            elapsed: Date.now() / 1000 - this.state.started_at
        } );
    }

    render() {
        const { elapsed } = this.state;
        const seconds = (elapsed).toFixed(1);
        
        return (
            <span style={{fontFamily: `"Lucida Console", Monaco, monospace`}}>{this.hhmmss(seconds)}</span>
        );
    }
}
export default Timer;