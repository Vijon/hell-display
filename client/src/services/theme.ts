import { css } from 'emotion';

export const vars = {
    colors: {
        white: '#ffffff',
        black: '#ffffff',
        grey: '#716f6f',
        greyLight: '#eee',
    },
    font: {
        size: {
            normal: 18
        },
        weight: {
            normal: 400,
            bold: 700
        }
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1216,
        widescreen: 1408
    },
    touch: 44,
    navHeight: 70,
    footerHeight: 34
};

export const classNames = (...args: (string | null)[]) => {
    return args.filter(a => a !== null).join(' ');
};

// re-export
export { css };