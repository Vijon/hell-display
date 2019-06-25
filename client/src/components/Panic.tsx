import * as React from 'react';
import { css } from '../services/theme';

const Style = css`
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    overflow: hidden;
    
    > img {
        width: 100%;
    }
    
`;

class Panic extends React.Component {
    render() {
        const srcs = [
            // tslint:disable-next-line:max-line-length
            '4chan.png', 'agenziaentrate.png', 'bsod.png', 'facebook.png', 'office1.jpg', 'office2.jpg', 'old_office.png', 'old_windows.png', 'shell.jpg', 'youtube.png',
        ];
        const src = require('./panic/' + srcs[Math.floor(Math.random() * srcs.length)]);

        return (
            <section className={Style}>
                <img src={src} />
            </section>
        );
    }
}
export default Panic;