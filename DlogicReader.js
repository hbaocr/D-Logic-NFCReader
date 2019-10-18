const util = require('./utils');
const CODE = require('./constant');
const logger = require('winston').loggers.get('uRFReader');
const EventEmitter = require('events').EventEmitter;

class DlogicFrame {

    static is_err_frame(buffer) {
        return (buffer[0] == CODE.ERR_HEADER);
    }
    static is_ack_frame(buffer) {
        return (buffer[0] == CODE.ACK_HEADER);
    }
    static is_resp_frame(buffer) {
        return (buffer[0] == CODE.RESPONSE_HEADER);
    }

    static is_valid_frame(buffer) {
        let l = buffer.length;
        let is_len_valid = (l >= CODE.PACKET_LENGTH) && (l <= CODE.MAX_PACKET_LENGTH);
        let is_ack_frame = (buffer[0] == CODE.ACK_HEADER);
        let is_err_frame = (buffer[0] == CODE.ERR_HEADER);
        let is_resp_frame = (buffer[0] == CODE.RESPONSE_HEADER);
        return is_len_valid && (is_ack_frame || is_err_frame || is_resp_frame);
    }
}

class DlogicReader extends EventEmitter {
    constructor(serialport) {

        super();

        this.serialport = serialport;
        this.buffer = new Buffer.from([]);
        this.HW_INIT_TIME  = 100;//100ms to init hw after reset
        this.CMD_TIMEOUT   = 1000;//100ms to init hw after reset

        this._processBuffer = this._processBuffer.bind(this);
        this.serialport.on('error', (error) => {
            this.emit('port_err',error);
        });
        this.serialport.on('open',(err)=>{
            //port.set({rts:true/false} only can take effect only when serialport already open.
            // Any call this function before port ready are rejected and not success.
            // This uRF reader require rts low to work, otherwise it is in reset state
            if (err) {
                console.error('Error opening serial port:', error);
                this.emit('port_err',err);
                return;
            }
            this.serialport.set({rts:false},()=>{
               
                let msg='PIN rts is low.UrfReader Ready to work in normal mode';
                console.log(msg);
                setTimeout(()=>{
                    //reader.send_command(new Buffer.from([0x55, 0x10, 0xAA, 0x00, 0x00, 0x00, 0xF6]))
                    this.emit('ready',msg);
                  },this.HW_INIT_TIME)
               
            })

        })
        this.serialport.on('data', (data) => {
            this.buffer = Buffer.concat([this.buffer, data]);
            this._processBuffer();
        });
    }

    clear_rx_cache(){
        this.buffer = new Buffer.from([]);//clear all data
    }
    _processBuffer() {
       
        if (DlogicFrame.is_valid_frame(this.buffer)) {
            console.log('receive: ', util.to_hex_string(this.buffer));
            let fr_type = this.buffer[0];
            this.emit('frame',{type:fr_type,buffer:this.buffer});
            // switch (fr_type) {
            //     case CODE.ERR_HEADER:
            //         this.emit('frame_err', this.buffer);
            //         break;
            //     case CODE.ACK_HEADER:
            //         this.emit('frame_ack', this.buffer);
            //         break;
            //     case CODE.RESPONSE_HEADER:
            //         this.emit('frame_resp', this.buffer);
            //         break;
            //     default:
            //         this.emit('frame_unknown', this.buffer);
            //         break;
            // }           
        }
    }

    //GET_CARD_ID_EX (0x2C)  : Use this function for cards with UID longer than 4 byte
    get_card_id_ex(timeout_ms=this.CMD_TIMEOUT){
        return new  Promise((resolve,reject)=>{
            //there are limitted number of listener(255).So in oder to use
            //for long time, you need to remove listener after finish the cmd
            let remove_listener = () => {
                this.removeListener('frame', on_frame);
            };
            let on_frame=(frame)=>{
                switch (frame.type) {
                    case  CODE.ERR_HEADER: /* No card */
                        
                        break;
                    case CODE.RESPONSE_HEADER:/*have card */
                        break;
                    default:
                        break;
                }
            };
            this.on('frame',on_frame);

            setTimeout(()=>{
                reject('cmd_timeout');
            },timeout_ms);
            //cmd SELF_RESET (0X30)
            this.send_command("55 2C AA 00 00 00 DA");
        });
    }
    self_reset(timeout_ms=this.CMD_TIMEOUT){
        return new  Promise((resolve,reject)=>{
            //there are limitted number of listener(255).So in oder to use
            //for long time, you need to remove listener after finish the cmd
            let remove_listener = () => {
                this.removeListener('frame', on_frame);
            };
            let on_frame=(frame)=>{
                //{type:fr_type,buffer:this.buffer}
                if(frame.type==CODE.RESPONSE_HEADER){
                    remove_listener();//remove to resever for next  time
                    resolve(frame.buffer);
                }else{
                    remove_listener();////remove to resever for next  time
                    reject(frame.buffer);
                }
            };
            this.on('frame',on_frame);

            setTimeout(()=>{
                reject('cmd_timeout');
            },timeout_ms);
            //cmd SELF_RESET (0X30)
            this.send_command("55 30 AA 00 00 00 D6");
        });
    }
    get_reader_type(timeout_ms=this.CMD_TIMEOUT){
        return new  Promise((resolve,reject)=>{
            //there are limitted number of listener(255).So in oder to use
            //for long time, you need to remove listener after finish the cmd
            let remove_listener = () => {
                this.removeListener('frame', on_frame);
            };
            let on_frame=(frame)=>{
                //{type:fr_type,buffer:this.buffer}
                if(frame.type==CODE.RESPONSE_HEADER){
                    remove_listener();//remove to resever for next  time
                    resolve(frame.buffer);
                }else{
                    remove_listener();////remove to resever for next  time
                    reject(frame.buffer);
                }
            };
            this.on('frame',on_frame);

            setTimeout(()=>{
                reject('cmd_timeout');
            },timeout_ms);
            //cmd GET_READER_TYPE (0x10)
            this.send_command("55 10 AA 00 00 00 F6");
        });
    }
   
    send_command(cmd_infor){
        let sn_buff="";
        if(util.is_string(cmd_infor)){
            sn_buff= cmd_infor.split(" ").join("");//replace all space on string hex
            sn_buff=new Buffer.from(sn_buff, 'hex');
        }else{
            if(cmd_infor instanceof Array){
                sn_buff = new  Buffer.from(cmd_infor);
            }
            else{
                if(cmd_infor instanceof Buffer){
                    sn_buff=cmd_infor;
                }
                return false;
            }
        }
        this.clear_rx_cache();
        this.serialport.write(sn_buff);  
    }

}

module.exports = DlogicReader;