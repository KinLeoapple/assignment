import md5 from 'js-md5';

export const hash = (str) => {
    return md5.md5(str);
}