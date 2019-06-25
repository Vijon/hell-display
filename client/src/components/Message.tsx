import * as React from 'react';
import { css } from '../services/theme';
import Text from './Text';

export interface MessageClass { // [TODO] same as server
    id: string;
    text: string;
    data: string;
    url?: string;
    audio?: string;
    image?: string;
    video?: string;
    embed?: string;
}

const Styles = {
  image: css`
    max-width: 100%;
    max-height: 60vh;
  `,
  quote: css`
    font-size: 5em;
  `,
  embed: css`
    width: 90vw;
    height: 90vh;
  `
};

interface Props extends MessageClass {}

class Message extends React.Component<Props> {
  
  render() {
    const message = this.props;
    if (message.url) {
      // window.open(message.url, 'streamer');
      return (
        <div className="message">
          <iframe className={Styles.embed} src={message.url} frameBorder={'0'} />
          <p>
            <Text id="urlOpen" />
            &nbsp;
            <a href={message.url} target="_blank">{message.url}</a>
          </p>
        </div>
      );
    } else if (message.audio) {
      return (
        <div>
          <audio autoPlay={true} controls={true} preload="auto">
            <source src={message.audio} type="audio/ogg" />
          </audio>
          <p>{message.text}</p>
        </div>
      );
    } else if (message.image) {
      return (
        <div>
          <figure style={{margin: 0}}>
            <img className={Styles.image} src={message.image} />
          </figure>
          <p>{message.text}</p>
        </div>
      );
    } else if (message.video) {
      return (
        <div>
          <video autoPlay={true} loop={true} preload="auto">
            <source src={message.video} type="audio/ogg" />
          </video>
          <p>{message.text}</p>
        </div>
      );
    } else if (message.embed) {
      return (
        <div>
          <iframe className={Styles.embed} src={message.embed} frameBorder={'0'} />
          <p>{message.text}</p>
        </div>
      );
    } else {
      return (
        <div className="message">
          <em><Text id="someoneWrote" /></em>
          <blockquote className={Styles.quote}>
            <strong>{message.text}</strong>
          </blockquote>
        </div>
      );
    }
  }
}

export default Message;
