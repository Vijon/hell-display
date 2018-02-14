import * as React from 'react';
import glamorous from 'glamorous';

export interface MessageClass { // [TODO] same as server
    id: string;
    text: string;
    data: string;
    url?: string;
    audio?: string;
    image?: string;
}

const Styles = {
  image: glamorous.img(
      {
          maxWidth: '100%',
          maxHeight: '100%'
      }
  ),
  quote: glamorous.blockquote(
      {
          fontSize: '2em'
      }
  )
};

interface Props extends MessageClass {}

class Message extends React.Component<Props> {
  
  render() {
    const message = this.props;
    if (message.url) {
      window.open(message.url, 'streamer');
      return (
        <div className="message">
          Ti ho aperto un link. Sei contento?
        </div>
      );
    } else if (message.audio) {
      return (
        <div>
          <audio autoPlay={true} preload="none">
            <source src={message.audio} type="audio/ogg" />
          </audio>
          <p>{message.text}</p>
        </div>
      );
    } else if (message.image) {
      return (
        <div>
          <figure>
            <Styles.image src={message.image} />
          </figure>
          <p>{message.text}</p>
        </div>
      );
    } else {
      return (
        <div className="message">
          <em>Qualcuno ha scritto:</em>
          <Styles.quote>
            <strong>{message.text}</strong>
          </Styles.quote>
        </div>
      );
    }
  }
}

export default Message;
