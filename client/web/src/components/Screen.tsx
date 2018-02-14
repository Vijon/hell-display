import * as React from 'react';
import glamorous from 'glamorous';
import Message, { MessageClass } from './Message';
import Text from './Text';

interface Props {
    connected?: boolean;
    incoming?: boolean;
    message?: MessageClass;
}

const Styles = {
    screen: glamorous.div(
        {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            '@supports (display: grid)': {
                display: 'grid',
                gridGap: 10,
                gridTemplateAreas: `
                  "header header"
                  "content content"
                  "footer footer"
                `,
                gridTemplateRows: '10vh auto 10vh',
                justifyItems: 'center',
                alignItems: 'center'
              },
        }
    ),
    splash: glamorous.h1(
        {
            gridArea: 'header',
            fontSize: '4em',
            textTransform: 'uppercase',
            color: '#ff0000'
        }
    ),
    status: glamorous.div(
        {
            gridArea: 'footer',
            padding: '1em 2em',
            fontSize: '2em',
            color: '#fff'
        }
    ),
    message: glamorous.div(
        {
            gridArea: 'content',
            textAlign: 'center'
        }
    ),
};

class Screen extends React.Component<Props> {
    render() {
        const { connected, incoming, message } = this.props;
        
        return (
          <Styles.screen>
            <Styles.splash>
                <Text id="welcome" force={0} />
            </Styles.splash>
            <Styles.message>
            {message &&
            <Message {...message} />
            }
            </Styles.message>
            <Styles.status>
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
            </Styles.status>
          </Styles.screen>
        );
    }
}
export default Screen;