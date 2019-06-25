import * as React from 'react';
import { css } from '../services/theme';
import Text from './Text';

interface Props {
    onClick: Function;
}

const Style = css`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    > div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #430019;
        color: #fff;

        > img {
            position: absolute;
            left: 0;
            top: 0;
            max-width: 400px;
        }

        > header, > section {
            padding-left: 400px;
            padding-right: 5vw;
        }

        > header {
            > * {
                margin: 0;
            }

            > h1 {
                font-size: 8em;
            }
            > h2 {
                font-size: 4em;
            }
        }


        > section {
            clear: both;
            text-align: center;
            font-size: 3em;

            > div {
                display: flex;
                padding: 10px 0;
                border-top: 2px solid #ff0000;
                > * {
                    &:first-child {
                        width: 30%;
                        text-align: right;
                        padding-right: 1em;
                    }
                }
                kbd {
                    color: #ff0000;
                    border: 2px solid #000;
                    padding: 0 10px;
                    border-radius: 10px;
                }
            }
            > p {
                font-size: 1.3rem;
                > a {
                    color: inherit;
                    text-decoration: underline;
                }
            }
        }
    }
`;

class Splash extends React.Component<Props> {
    render() {
        const { onClick } = this.props;
        const src = require('./logo.png');

        return (
        <section
            className={Style}
            onClick={() => onClick()}
        >
            <div>
                <img src={src} />
                <header>
                    <h1>Hell&nbsp;Display</h1>
                    <h2><Text id="welcome" /*force={0}*/ timed={true} /></h2>
                </header>
                <section>
                    <div><span><kbd>&lt;</kbd> <kbd>&gt;</kbd></span><span>scorri i messaggi</span></div>
                    <div><span><kbd>Spazio</kbd></span><span>fai sparire tutto!</span></div>
                    <p>
                        Tieni la finestra aperta su uno dei tuoi monitor, 
                        verrà pilotata da tutti quelli che posteranno sul bot Telegram&nbsp;
                        <a href="https://telegram.me/HellDisplayBot">@HellDisplayBot</a>
                    </p>
                    <p>Ricordati, se proprio vuoi, di attivare i popup in alto nel browser!</p>
                </section>
            </div>
        </section>
        );
    }
}
export default Splash;