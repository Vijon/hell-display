import * as React from 'react';
import { css, classNames } from '../services/theme';
import {
    init,
    initNotifications,
    canReceiveNotifications,
    isReceivingNotifications,
    enableNotifications,
    disableNotifications
} from '../services/pwa';
// import Text from './Text';

interface Props {
    index?: number;
    messages?: number;
}

interface State {
    tooltip: boolean;
    canReceive: boolean;
    isReceiving: boolean;

}

const Style = css`
    position: relative;

    &.canReceiveNotifications {                
        cursor: pointer;
    }

    &.isReceivingNotifications {
        color: #000;
        background-color: #ff0000;
    }

    > header {
        position: absolute;
        bottom: 100%;
        transform: translate(-50%, 0);
        left: 50%;
        margin-bottom: 10px;
        border-radius: 5px;
        min-width: 200px;
        background: #000;
        padding: 10px;
        font-size: 15px;
        text-align: center;

        animation-name: bounce;
        animation-duration: 2.5s;
        animation-fill-mode: both;
        animation-timing-function: linear;
        animation-iteration-count: infinite;

        &:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, 0);
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 10px 10px 0 10px;
            border-color: #000000 transparent transparent transparent;
        }
    }
    @keyframes bounce { 
        0%, 20%, 40%, 60%, 80%, 100% {transform: translate(-50%, 0);}
        50% {transform: translate(-50%, -5px);}
    } 
`;

class SubscribePush extends React.Component<Props, State> {
    state = {
        tooltip: true,
        canReceive: false,
        isReceiving: false,
    } as State;

    async componentDidMount() {
        await init();
        await initNotifications();
        this.refresh();

        setTimeout( () => {
            this.setState({
                tooltip: false
            });
        }, 5000);
    }

    refresh() {
        this.setState({
            canReceive: canReceiveNotifications(),
            isReceiving: isReceivingNotifications()
        });
    }

    async toggleNotifications() {
        if (isReceivingNotifications()) {
            await disableNotifications();
        } else {
            await enableNotifications();
        }
        this.refresh();
    }

    render() {
        const { messages = 0, index = 0 } = this.props;
        const { tooltip, canReceive, isReceiving } = this.state;

        return (
        <span
            className={classNames(
                Style,
                canReceive ? 'canReceiveNotifications' : '',
                isReceiving ? 'isReceivingNotifications' : ''
            )}
            onClick={() => this.toggleNotifications()}
        >
            {tooltip && canReceive && !isReceiving &&
            <header>
                Attiva le notifiche!
            </header>
            }
            {messages === 0 &&
            <></>
            }
            {messages > 0 &&
            <>{index + 1} / {messages}</>
            }
        &nbsp;💬
        </span>
        );
    }
}
export default SubscribePush;