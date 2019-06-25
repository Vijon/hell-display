import * as React from 'react';
import { css } from '../services/theme';
import Loading from './Loading';
import Panic from './Panic';
import Message, { MessageClass } from './Message';
import Text from './Text';
import Timer from './Timer';
import AddHome from './AddHome';
import SubscribePush from './SubscribePush';

interface Props {
    connected?: boolean;
    incoming?: boolean;
    index: number;
    messages: MessageClass[];
    message?: MessageClass;
    playing?: boolean;
    users?: number;
    onPause?: Function;
    onNav?: Function;
}

const Styles = {
    screen: css`
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        @supports (display: grid) {
            display: grid;
            grid-gap: 10;
            grid-template-areas: 
                "header header"
                "content content"
                "footer footer";
            grid-template-rows: 10vh 80vh 10vh;
            justify-items: center;
            align-items: center;
        }
    `,
    splash: css`
        grid-area: header;
        font-size: 4em;
        text-transform: uppercase;
        color: #ff0000;

        .status {
            position: absolute;
            right: 1em;
            top: 1em;
            font-size: 14px;
            text-transform: none;
        }
    `,
    status: css`
        grid-area: footer;
        padding: 1em 2em;
        font-size: 2em;
        color: #ff0000;
    `,
    message: css`
        grid-area: content;
        text-align: center;
        color: #fff;
        font-size: 2em;

        a {
            color: inherit;
            text-decoration: underline;
        }
    `,
    stats: css`
        position: absolute;
        right: 1em;
        bottom: 1em;
        color: #ff0000;
        font-size: 1.5em;

        > span {
            display: inline-block;
            padding: 3px 10px;
            margin: 0 10px;
            background: #000;
            border-radius: 5px;
        }
    `,
    credits: css`
        position: absolute;
        left: 1em;
        bottom: 1em;
        > a {
            color: #ff0000;
            font-size: 1.5em;
        }

        img {
            vertical-align: middle;
            max-width: 70px;
            margin-right: 1em;
        }
    `
};

class Screen extends React.Component<Props> {
    
    render() {
        const { connected, incoming, message, playing, index, messages, users, onPause, onNav } = this.props;
        const src = require('./logo.png');

        return (
          <section
            className={Styles.screen}
            tabIndex={0}
            /*onClick={() => { if (onPause) { onPause(); } }} */
            onKeyDown={(e) => {
                if (e.keyCode === 32 && onPause) { onPause(); } // spacebar
                if (e.keyCode === 37 && onNav) { onNav(-1); } // left
                if (e.keyCode === 39 && onNav) { onNav(1); } // right
            }}
          >
            <div className={Styles.splash}>
                HELL DISPLAY
                
                <div className="status">
                    {incoming === true &&
                    <span><Text id="incomingMsg" timed={true} /></span>
                    }
                    {!incoming && connected === undefined &&
                    <span><Text id="connectingMsg" timed={true} /></span>
                    }
                    {!incoming && connected === true &&
                    <span><Text id="connectedMsg" timed={true} /></span>
                    }
                    {!incoming && connected === false &&
                    <span><Text id="disconnectedMsg" timed={true} /></span>
                    }
                </div>
            </div>
            <article className={Styles.message}>
            {message && playing && !incoming &&
            <Message {...message} />
            }
            {!playing &&
            <Loading />
            }
            {playing !== undefined && !playing &&
            <Panic />
            }
            {incoming &&
            <Loading fast={true} />
            }
            
            </article>
            <nav className={Styles.status}>
                <AddHome />
            </nav>
            <nav className={Styles.credits}>
                <img src={src} />
                <a href="https://telegram.me/HellDisplayBot">@HellDisplayBot</a>
            </nav>
            <nav className={Styles.stats}>
                <SubscribePush messages={messages.length} index={index} />
                <span><Timer /></span>
                <span>{users} 😈</span>
            </nav>
          </section>
        );
    }
}
export default Screen;