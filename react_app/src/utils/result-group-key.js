import md5 from 'blueimp-md5'

export default  (query) => {
    return md5(`${query}`);
};