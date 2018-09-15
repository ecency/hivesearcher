import md5 from 'blueimp-md5'

export default  (search) => {
    return md5(search)
};