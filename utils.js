const card_types =[
    "UNKNOWN",
    "DL_MIFARE_ULTRALIGHT",
    "DL_MIFARE_ULTRALIGHT_EV1_11",
    "DL_MIFARE_ULTRALIGHT_EV1_21",
    "DL_MIFARE_ULTRALIGHT_C",
    "DL_NTAG_203",
    "DL_NTAG_210",
    "DL_NTAG_212",
    "DL_NTAG_213",
    "DL_NTAG_215",
    "DL_NTAG_216",
    "MIKRON_MIK640D",
    "NFC_T2T_GENERIC",
    "DL_MIFARE_MINI",
    "DL_MIFARE_CLASSIC_1K",
    "DL_MIFARE_CLASSIC_4K",
    "DL_MIFARE_PLUS_S_2K",
    "DL_MIFARE_PLUS_S_4K",
    "DL_MIFARE_PLUS_X_2K",
    "DL_MIFARE_PLUS_X_4K",
    "DL_MIFARE_DESFIRE",
    "DL_MIFARE_DESFIRE_EV1_2K",
    "DL_MIFARE_DESFIRE_EV1_4K",
    "DL_MIFARE_DESFIRE_EV1_8K",
    "DL_MIFARE_DESFIRE_EV2_2K",
    "DL_MIFARE_DESFIRE_EV2_4K",
    "DL_MIFARE_DESFIRE_EV2_8K",
    "DL_GENERIC_ISO14443_4",
    "DL_GENERIC_ISO14443_TYPE_B",
    "DL_IMEI_UID"
];

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
function get_card_type_from_code(type_code){
    if(type_code==33){
        return "UNKNOWN_MIFARE_CLASSIC_1K"
    }
    if(type_code >= card_types.length){
        return card_types[0];
    }else{
       return card_types[type_code];
    }
}
module.exports.get_card_type_from_code=get_card_type_from_code;
module.exports.crc_calc = crc_calc;
module.exports.is_string = is_string;
module.exports.to_hex_string = to_hex_string;

