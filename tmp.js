const util = require('./utils');
const CODE = require('./constant');

const NTAG_NO_PWD_AUTH_CODE =0x60;
const NTAG_PWD_AUTH_CODE =0x61;
//generate_block_read_cmd(0);
generate_linear_write_cmd(NTAG_NO_PWD_AUTH_CODE,0,8);

//this cmd  will read 16byte from block Addr
function generate_block_read_cmd(block_addr,auth_mode=NTAG_NO_PWD_AUTH_CODE,key= [0x00, 0x00, 0x00, 0x00, 0x00, 0x00]){
    let cmd_code = CODE.BLOCK_READ;
    let cmd_ext=[
        block_addr,
        0,
        0,
        0,
        ...key
    ];
    let crc = util.crc_calc(cmd_ext);
    cmd_ext.push(crc);

    let cmd = [
        0x55,
        cmd_code,
        0xAA,
        cmd_ext.length,
        auth_mode,
        0x00
    ]
    crc =util.crc_calc(cmd);
    cmd.push(crc);

    cmd_info ={
        CMD:new  Buffer.from(cmd),
        CMD_EXT: new Buffer.from(cmd_ext)
    }

    console.log(cmd_info)
}

function generate_block_write_cmd(block_addr,auth_mode=NTAG_NO_PWD_AUTH_CODE,write_buffer,key){
    let cmd_code = CODE.BLOCK_WRITE;
    if(key==undefined){
        key=[0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    }
    write_buffer = new Buffer.alloc(16,0);
    //note that for NTAG only write 4 byte for 1 page   ( block= page addr). The other will  treat  as dummy byte
    write_buffer[0]=0x30;
    write_buffer[1]=0x31;
    write_buffer[2]=0x32;
    write_buffer[3]=0x33;
    write_buffer[4]=0x34;
    write_buffer[5]=0x35;
    write_buffer[6]=0x36;
    write_buffer[7]=0x37;

    let cmd_ext=[
        block_addr,
        0,
        0,
        0,
        ...key,
        ...write_buffer
    ];
    let crc = util.crc_calc(cmd_ext);
    cmd_ext.push(crc);

    let cmd = [
        0x55,
        cmd_code,
        0xAA,
        cmd_ext.length,
        auth_mode,
        0x00
    ]
    crc =util.crc_calc(cmd);
    cmd.push(crc);

    cmd_info ={
        CMD:new  Buffer.from(cmd),
        CMD_EXT: new Buffer.from(cmd_ext)
    }

    console.log(cmd_info)
}

function generate_linear_write_cmd(auth_mode=NTAG_NO_PWD_AUTH_CODE,start_addr=0x04,data_len=0x08,write_buffer,key){
    //linear write  cmd  start at  the  user writable sector  and set  the first byte as addr0. in NTAG 213 the  first
    //byte is the  first byte of page  04
    let cmd_code = CODE.LINEAR_WRITE;
    if(key==undefined){
        key=[0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    }
    write_buffer = new Buffer.alloc(8,0);
    //note that for NTAG only write 4 byte for 1 page   ( block= page addr). The other will  treat  as dummy byte
    write_buffer[0]=0x32;
    write_buffer[1]=0x33;
    write_buffer[2]=0x34;
    write_buffer[3]=0x35;
    write_buffer[4]=0x36;
    write_buffer[5]=0x37;
    write_buffer[6]=0x38;
    write_buffer[7]=0x39;

    let cmd_ext=[
        start_addr&0x000000FF,
        (start_addr>>8)&0x000000FF,
        data_len&0x000000FF,
        (data_len>>8)&0x000000FF,
        ...key,
        ...write_buffer
    ];
    let crc = util.crc_calc(cmd_ext);
    cmd_ext.push(crc);

    let cmd = [
        0x55,
        cmd_code,
        0xAA,
        cmd_ext.length,
        auth_mode,
        0x00
    ]
    crc =util.crc_calc(cmd);
    cmd.push(crc);

    cmd_info ={
        CMD:new  Buffer.from(cmd),
        CMD_EXT: new Buffer.from(cmd_ext)
    }

    console.log(cmd_info)
}