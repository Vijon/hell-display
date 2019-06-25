import * as React from 'react';
import { css, classNames } from '../services/theme';

interface Props {
    fast?: boolean;
}

const Style = css`
    .c {
        position: absolute;
        top: 50%;
        left: 50%;
    }

    .s {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        float: left;
        background: #ff0000;
        transition: all 0.2s;
        animation: r5 1s 0s ease-out infinite;
    }
    &.fast {
        .s {
            animation-duration: .3s;
        }
    }

    @-webkit-keyframes r5 {
    0% {
        box-shadow: 0 0 8px 6px rgba(0,0,0, .5), 0 0 0px 0px transparent, 0 0 0px 0px rgba(0,0,0, .7);
    }
    10% {
        transform:scale(1,1);
        box-shadow: 0 0 8px 6px rgba(0,0,0, .5), 0 0 12px 10px transparent, 0 0 12px 14px rgba(0,0,0, .7);
    }
    100% {
        box-shadow: 0 0 8px 6px rgba(255,255,255, 0), 0 0 0px 40px transparent, 0 0 0px 40px rgba(255,255,255, 0);
    }
    }
    @-moz-keyframes r5 {
    0% {
        box-shadow: 0 0 8px 6px rgb(0,0,0), 0 0 0px 0px transparent, 0 0 0px 0px rgb(0,0,0);
    }
    10% {
        box-shadow: 0 0 8px 6px rgb(0,0,0), 0 0 12px 10px transparent, 0 0 12px 14px rgb(0,0,0);
    }
    100% {
        box-shadow: 0 0 8px 6px rgba(255,255,255, 0), 0 0 0px 40px transparent, 0 0 0px 40px rgba(255,255,255, 0);
    }
    }
    @keyframes r5 {
    0% {
        box-shadow: 0 0 8px 6px rgb(0,0,0), 0 0 0px 0px transparent, 0 0 0px 0px rgb(0,0,0);
    }
    10% {
        box-shadow: 0 0 8px 6px rgb(0,0,0), 0 0 12px 10px transparent, 0 0 12px 14px rgb(0,0,0);
    }
    100% {
        box-shadow: 0 0 8px 6px rgba(255,255,255, 0), 0 0 0px 40px transparent, 0 0 0px 40px rgba(255,255,255, 0);
    }
    }
`;

class Loading extends React.Component<Props> {
    render() {
        const { fast = false } = this.props;
        return (
        <div className={classNames(Style, fast ? 'fast' : null)}>
            <div className="c">
                <div className="s" />
            </div>
        </div>
        );
    }
}
export default Loading;