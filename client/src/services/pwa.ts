// tslint:disable:no-console

var _initing: Promise<void>;
var _passed = false; var _passed2 = false;
var _canReceiveNotifications = false;
var _receivingNotifications = false;
// tslint:disable-next-line:no-any
var event: any;
var registration: ServiceWorkerRegistration;

var _resolvers: Function[] = [];
export const init = (): Promise<void> => {
    /* register service worker and install */
    if (_passed) {
        return Promise.resolve();
    }
    if (!_initing) {
        _initing = new Promise( async resolve => {
            await registerSW();
            resolve();
            _passed = true;
        });
        _initing.then( () => {
            // resolve all!
            _resolvers.forEach( r => r() );
        });
    }
    return new Promise( resolve => {
        /// collect resolvers
        _resolvers.push( resolve );
    });
};

export const initAddToHome = (): Promise<void> => {
    if (_passed2) {
        return Promise.resolve();
    }
    return new Promise( resolve => {
        // tslint:disable-next-line:no-any
        window.addEventListener('beforeinstallprompt', (e: any) => {
            e.preventDefault();
            event = e;
            resolve();
            _passed2 = true;
        });
    });
};

export const addToHome = (): Promise<void> => {
    return new Promise( (resolve, reject) => {
        // tslint:disable-next-line:no-any
        event.userChoice.then((res: any) => {
            if (res.outcome === 'accepted') {
                resolve();
            } else {
                reject();
            }
            // tslint:disable-next-line:no-any
        }, (err: any) => {
            reject( err );
        });
        event.prompt();
    });
};

export const initNotifications = (): Promise<void> => {
    return new Promise( resolve => {
        /* check notifications */
        if ('Notification' in window) {
            _canReceiveNotifications = true;
        }
        // tslint:disable-next-line:no-string-literal
        if (Notification['permission'] === 'granted') {
            if (registration && registration.pushManager) {
                registration.pushManager.getSubscription().then( (subscription: PushSubscription) => {
                    _receivingNotifications = !!subscription;
                    resolve();
                });
            }
        }
    });
};

export const canReceiveNotifications = () => {
    return _canReceiveNotifications;
};

export const isReceivingNotifications = () => {
    return _receivingNotifications;
};

export const enableNotifications = () => {
    return new Promise( resolve => {
        Notification.requestPermission().then( async permission => {
            if (permission !== 'granted') {
                // no notifications
            } else {
                await registerPushSubscription();
                resolve();
            }
        });
    });
};

export const disableNotifications = () => {
    return unregisterPushSubscription();
};

async function registerSW() {
    if ('serviceWorker' in navigator) {
        // control same domain (sw doesn't work cross-domain)
        const publicUrl = new URL(
            process.env.PUBLIC_URL!,
            window.location.toString()
        );
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
        await installSW(swUrl);
    }
}

function installSW(swUrl: string): Promise<string> {
    return new Promise( (resolve, reject) => {
        navigator.serviceWorker
        .register(swUrl)
        .then( _reg => {
            registration = _reg;
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New content is available; please refresh.
                                resolve('updated');
                            } else {
                                // 'Content is cached for offline use.
                                resolve('ready');
                            }
                        }
                    };
                }
            };
            if (registration && registration.active && registration.active.state) {
                resolve('ready');
            }
        })
        .catch(error => {
            // Error during service worker registration
            reject(error);
        });
    });
}

function publicApiUrl() {
    // tslint:disable-next-line:max-line-length
    return `${process.env.REACT_APP_SECURE ? 'https' : 'http'}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT_WEB}`;
}

function registerPushSubscription() {
    return new Promise( resolve => {
        // register push notification (https://thecodebarbarian.com/sending-web-push-notifications-from-node-js.html)
        registration.pushManager.
        subscribe({
            userVisibleOnly: true,
            // The `urlBase64ToUint8Array()` function is the same as in
            // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
            applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY as string)
        }).then( subscription => {
            // console.log('Registered push');
            // console.log('Sending push');
            fetch(publicApiUrl(), {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'content-type': 'application/json'
                }
            }).then( () => {
                // console.log('Sent push');
                _receivingNotifications = true;
                resolve();
            });
        } );
    });
}

function unregisterPushSubscription() {
    return new Promise( (resolve, reject) => {
        var _sub: PushSubscription;
        // register push notification (https://thecodebarbarian.com/sending-web-push-notifications-from-node-js.html)
        registration.pushManager.getSubscription()
        .then((subscription: PushSubscription) => {
            if (subscription) {
                _sub = subscription;
                return subscription.unsubscribe();
            }
            return false;
        })
        // tslint:disable-next-line:no-any
        .catch((error: any) => {
            // console.log('Error unsubscribing', error);
        })
        .then(function(result: boolean) {
            if (result) {
                // tslint:disable-next-line:max-line-length
                fetch(publicApiUrl(), {
                    method: 'DELETE',
                    body: JSON.stringify(_sub),
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then( () => {
                    // console.log('Unsubscribed push');
                    _receivingNotifications = false;
                    resolve();
                });
                _receivingNotifications = false;
            } else {
                reject();
            }
        });
    });
}

// PUSH utilities
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}