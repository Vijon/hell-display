import * as React from 'react';
import * as io from 'socket.io-client';
import Screen from './components/Screen';
import { MessageClass } from './components/Message';

const socket = io(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`);

interface State {
  connected?: boolean;
  incoming?: boolean;
  message?: MessageClass;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }
  
  componentDidMount() {
    socket.on('connect', () => {
      this.setState( { connected: true });
    });
    socket.on('broadcast', (data: MessageClass)  => {
      this.setState( {
        incoming: true,
        message: data
      });
      setTimeout(() => {
        this.setState({ incoming: false });
      }, 3000);
      console.log('broadcast', data);
    });
    socket.on('disconnect', () => {
      this.setState( { connected: false });
    });
  }

  render() {
    return (
      <Screen {...this.state} />
    );
  }
}

export default App;
