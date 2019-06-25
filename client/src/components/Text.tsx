import * as React from 'react';

interface Props {
    id: string;
    timed?: boolean;
    force?: number;
}

interface State {
    text?: string;
    index?: number;
}

import * as _ from '../texts';

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var _timer: NodeJS.Timer;
var _counter = 0;
class Text extends React.Component<Props, State> {
    private $mounted = false;

    componentDidMount() {
        this.$mounted = true;
        const { id, timed, force } = this.props;
        
        var text;
        const refresh = () => {
            let lines = _[id].split(`\n`).filter( (l: string) => (l !== '') );
            text = lines[ (force !== undefined && _counter === 0) ? force : Math.floor(Math.random() * lines.length) ];
            if (timed === true) {
                _timer = setTimeout( () => {
                    if (this.$mounted) {
                        _counter++;
                        refresh();
                        this.forceUpdate();
                    }
                }, getRandomInt(3000, 10000) );
            }
            this.setState( { text } );
        };

        if (typeof _[id] === 'undefined') {
            text = id;
            this.setState( { text } );
        } else {
            refresh();

        }
    }

    componentWillUnmount() {
        this.$mounted = false;
        if (_timer) {
            clearTimeout( _timer );
        }
    }

    render() {
        if (!this.state) {
            return null;
        }
        return (
          <span>{this.state.text}</span>
        );
    }
}
export default Text;