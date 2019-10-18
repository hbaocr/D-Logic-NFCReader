exports.TIMEOUT_MS=100 // Debugging
// Communication constants
exports.MAX_PACKET_LENGTH =64
exports.HEADER_BYTE       =0
exports.CMD_BYTE          =1
exports.TRAILER_BYTE      =2
exports.EXT_LENGTH_BYTE   =3
exports.PAR0_BYTE         =4
exports.PAR1_BYTE         =5
exports.CHKSUM_BYTE       =6
exports.PACKET_LENGTH     =7
exports.CMD_HEADER        =0x55
exports.ACK_HEADER        =0xAC
exports.RESPONSE_HEADER   =0xDE
exports.ERR_HEADER        =0xEC
exports.CMD_TRAILER       =0xAA
exports.ACK_TRAILER       =0xCA
exports.RESPONSE_TRAILER  =0xED
exports.ERR_TRAILER       =0xCE
// CMD codes
exports.GET_READER_TYPE             =0x10
exports.GET_READER_SERIAL           =0x11
exports.READER_KEY_WRITE            =0x12
exports.GET_CARD_ID                 =0x13
exports.LINEAR_READ                 =0x14
exports.LINEAR_WRITE                =0x15
exports.BLOCK_READ                  =0x16
exports.BLOCK_WRITE                 =0x17
exports.BLOCK_IN_SECTOR_READ        =0x18
exports.BLOCK_IN_SECTOR_WRITE       =0x19
exports.SECTOR_TRAILER_WRITE        =0x1A
exports.USER_DATA_READ              =0x1B
exports.USER_DATA_WRITE             =0x1C
exports.VALUE_BLOCK_READ            =0x1D
exports.VALUE_BLOCK_WRITE           =0x1E
exports.VALUE_BLOCK_IN_SECTOR_READ  =0x1F
exports.VALUE_BLOCK_IN_SECTOR_WRITE =0x20
exports.VALUE_BLOCK_INC             =0x21
exports.VALUE_BLOCK_DEC             =0x22
exports.VALUE_BLOCK_IN_SECTOR_INC   =0x23
exports.VALUE_BLOCK_IN_SECTOR_DEC   =0x24
exports.LINEAR_FORMAT_CARD          =0x25
exports.USER_INTERFACE_SIGNAL       =0x26
exports.GET_CARD_ID_EX              =0x2C
exports.SECTOR_TRAILER_WRITE_UNSAFE =0x2F
exports.SELF_RESET                  =0x30
exports.GET_DLOGIC_CARD_TYPE        =0x3C
exports.SET_CARD_ID_SEND_CONF       =0x3D
exports.GET_CARD_ID_SEND_CONF       =0x3E
exports.SET_LED_CONFIG				=0x6E
exports.SET_UART_SPEED              =0x70
exports.RED_LIGHT_CONTROL           =0x71
exports.GET_DESFIRE_UID             =0x80

// ERR codes
exports.OK                                      =0x00
exports.COMMUNICATION_ERROR                     =0x01
exports.COMMUNICATION_TIMEOUT                   =0x50
exports.COMMUNICATION_TIMEOUT_EXT               =0x51
exports.CHKSUM_ERROR                            =0x02
exports.CHKSUM_ERROR_RESPONSE                   =0x52
exports.CHKSUM_ERROR_EXT                        =0x53
exports.READING_ERROR                           =0x03
exports.WRITING_ERROR                           =0x04
exports.BUFFER_OVERFLOW                         =0x05
exports.MAX_ADDRESS_EXCEEDED                    =0x06
exports.MAX_KEY_INDEX_EXCEEDED                  =0x07
exports.NO_CARD                                 =0x08
exports.COMMAND_NOT_SUPPORTED                   =0x09
exports.FORBIDEN_DIRECT_WRITE_IN_SECTOR_TRAILER =0x0A
exports.ADDRESSED_BLOCK_IS_NOT_SECTOR_TRAILER   =0x0B
exports.WRONG_ADDRESS_MODE                      =0x0C
exports.WRONG_ACCESS_BITS_VALUES                =0x0D
exports.AUTH_ERROR                              =0x0E
exports.PARAMETERS_ERROR                        =0x0F
exports.WRITE_VERIFICATION_ERROR                =0x70
exports.BUFFER_SIZE_EXCEEDED                    =0x71
exports.VALUE_BLOCK_INVALID                     =0x72
exports.VALUE_BLOCK_ADDR_INVALID                =0x73
exports.VALUE_BLOCK_MANIPULATION_ERROR          =0x74



// MIFARE CLASSIC type id's:
exports.MIFARE_CLASSIC_1k   =0x08
exports.MF1ICS50            =0x08
exports.SLE66R35            =0x88 // Infineon = Mifare Classic 1k
exports.MIFARE_CLASSIC_4k   =0x18
exports.MF1ICS70            =0x18
exports.MIFARE_CLASSIC_MINI =0x09
exports.MF1ICS20            =0x09

// DLOGIC CARD TYPE
exports.TAG_UNKNOWN                 =0
exports.DL_MIFARE_ULTRALIGHT        =0x01
exports.DL_MIFARE_ULTRALIGHT_EV1_11 =0x02
exports.DL_MIFARE_ULTRALIGHT_EV1_21 =0x03
exports.DL_MIFARE_ULTRALIGHT_C      =0x04
exports.DL_NTAG_203                 =0x05
exports.DL_NTAG_210                 =0x06
exports.DL_NTAG_212                 =0x07
exports.DL_NTAG_213                 =0x08
exports.DL_NTAG_215                 =0x09
exports.DL_NTAG_216                 =0x0A
exports.DL_MIKRON_MIK640D           =0x0B
exports.NFC_T2T_GENERIC             =0x0C
exports.DL_MIFARE_MINI              =0x20
exports.DL_MIFARE_CLASSIC_1K        =0x21
exports.DL_MIFARE_CLASSIC_4K        =0x22
exports.DL_MIFARE_PLUS_S_2K         =0x23
exports.DL_MIFARE_PLUS_S_4K         =0x24
exports.DL_MIFARE_PLUS_X_2K         =0x25
exports.DL_MIFARE_PLUS_X_4K         =0x26
exports.DL_MIFARE_DESFIRE           =0x27
exports.DL_MIFARE_DESFIRE_EV1_2K    =0x28
exports.DL_MIFARE_DESFIRE_EV1_4K    =0x29
exports.DL_MIFARE_DESFIRE_EV1_8K    =0x2A
exports.DL_MIFARE_DESFIRE_EV2_2K    =0x2B
exports.DL_MIFARE_DESFIRE_EV2_4K    =0x2C
exports.DL_MIFARE_DESFIRE_EV2_8K    =0x2D
//exports.DL_UNKNOWN_ISO_14443_4      =0x40
exports.DL_GENERIC_ISO14443_4       =0x40
exports.DL_GENERIC_ISO14443_TYPE_B  =0x41
exports.DL_IMEI_UID                 =0x80

// Function return sizes in bytes
exports.READER_TYPE_SIZE   =4
exports.READER_SERIAL_SIZE =4
exports.READER_KEY_SIZE    =6
exports.USER_DATA_SIZE     =16
exports.CARD_ID_SIZE       =4
exports.CARD_ID_EX_SIZE    =10


// USER_INTERFACE_SIGNAL

exports.NONE                =0
exports.LONG_GREEN          =1
exports.SHORT_BEEP          =1
exports.LONG_RED            =2
exports.LONG_BEEP           =2
exports.ALTERNATNG_LIGHT    =3
exports.DOUBLE_SHORT_BEEP   =3
exports.FLASH_LIGHT         =4
exports.TRIPLE_SHORT_BEEP   =4
exports.TRIPLET_MELODY      =5
