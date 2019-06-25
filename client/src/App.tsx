import * as React from 'react';
import * as io from 'socket.io-client';
import * as ReactGA from 'react-ga';

import Splash from './components/Splash';
import Screen from './components/Screen';
import { MessageClass } from './components/Message';

// tslint:disable-next-line:max-line-length
const socket = io(`${process.env.REACT_APP_SECURE ? 'https' : 'http'}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT_SOCKET}`);

if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

import notification from './notification';
const audio = new Audio(notification);

interface State {
  connected?: boolean;
  incoming?: boolean;
  message?: MessageClass;
  index: number;
  messages: MessageClass[];
  playing?: boolean;
  users?: number;
  splash: boolean;
  focus?: boolean;
  toRead?: number;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      index: 0,
      messages: [],
      users: 0,
      splash: true,
      focus: true
    };
  }

  _pause() {
    this.setState( { playing: !this.state.playing } );
  }

  _nav(dir: number) {
    let { index, messages } = this.state;
    const max = messages.length - 1;
    index += dir;
    index = (index > max) ? max : (index < 0) ? 0 : index;
    this.setState( { index, message: messages[index] } );
  }

  closeSplash() {
    this.setState( { splash: false } );
  }
  
  componentDidMount() {
    socket.on('connect', () => {
      this.setState( { connected: true });
    });
    socket.on('broadcast', (data: MessageClass)  => {
      let { index, messages, focus, toRead = 0 } = this.state;
      messages = messages.concat(data);
      const max = messages.length - 1;
      let state;
      if (index < max - 1) {
        state = {
          index
        };
      } else {
        state = {
          message: data,
          index: max,
        };
      }
      if (!focus) {
        toRead++;
      }
      this.setState( {
        incoming: true,
        messages,
        playing: true,
        splash: false,
        toRead,
        ...state,
      });
      setTimeout(() => {
        this.setState({ incoming: false });
      }, 1000);
      audio.play();
    });
    socket.on('users:online', (users: number) => {
      this.setState( {
        users
      });
    });
    socket.on('disconnect', () => {
      this.setState( { connected: false });
    });

    window.addEventListener('focus', (event: Event) => { 
        this.setState({ focus: true, toRead: 0 });
    }, false);
    window.addEventListener('blur', (event: Event) => { 
      this.setState({ focus: false });
    }, false);
  }

  render() {
    const { splash, toRead = 0 } = this.state;
    document.title = (toRead === 0) ? 'Hell Display' : `(${toRead}) Hell Display`;
    if (splash) {
      return <Splash onClick={() => this.closeSplash()} />;
    } else {
      return <Screen {...this.state} onPause={() => this._pause()} onNav={(dir: number) => this._nav(dir)}  />;
    }
  }
}

export default App;
