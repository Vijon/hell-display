import * as React from 'react';
import * as io from 'socket.io-client';
import Screen from './components/Screen';
import { MessageClass } from './components/Message';

const socket = io(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`);

import notification from './notification';
const audio = new Audio(notification);

interface State {
  connected?: boolean;
  incoming?: boolean;
  message?: MessageClass;
  playing?: boolean;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  _pause() {
    this.setState( { playing: !this.state.playing } );
  }
  
  componentDidMount() {
    socket.on('connect', () => {
      this.setState( { connected: true });
    });
    socket.on('broadcast', (data: MessageClass)  => {
      this.setState( {
        incoming: true,
        message: data,
        playing: true
      });
      setTimeout(() => {
        this.setState({ incoming: false });
      }, 3000);
      audio.play();
      console.log('broadcast', data);
    });
    socket.on('disconnect', () => {
      this.setState( { connected: false });
    });
  }

  render() {
    return (
      <Screen {...this.state} onPause={() => this._pause()} />
    );
  }
}

export default App;
