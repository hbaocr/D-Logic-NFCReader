

function crc_calc(buffer) {
    let r = buffer[0];
    for (let i = 1; i < buffer.length; i++) {
        r = r ^ buffer[i];
    }
    let crc = (r + 0x07) & 0x000000FF;
    return crc;
}
function is_string(s) {
    return typeof(s) === 'string' || s instanceof String;
}
function to_hex_string(buff) {
    return buff.toString('hex').match(/.{1,2}/g).join(':');
}
module.exports.crc_calc = crc_calc;
module.exports.is_string = is_string;
module.exports.to_hex_string = to_hex_string;