import * as React from 'react';
import glamorous from 'glamorous';
import Message, { MessageClass } from './Message';

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
            color: '#ff0000'
        }
    ),
    status: glamorous.div(
        {
            gridArea: 'footer',
            padding: '1em 2em',
            backgroundColor: 'orange'
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
              Hell display
            </Styles.splash>
            <Styles.message>
            {message &&
            <Message {...message} />
            }
            </Styles.message>
            <Styles.status>
                <div className="status">
                {incoming === true &&
                <span>In ricezione!</span>
                }
                {!incoming && connected === undefined &&
                <span>Ti stiamo connettendo da qualche parte.</span>
                }
                {!incoming && connected === true &&
                <span>Connesso, è stata una tua scelta.</span>
                }
                {!incoming && connected === false &&
                <span>Il server è esploso.</span>
                }
                </div>
            </Styles.status>
          </Styles.screen>
        );
    }
}
export default Screen;