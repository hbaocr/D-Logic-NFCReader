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
        
        this.CMD_TIMEOUT   = 80;//20ms to timeout cmd
        this.TIMEOUT_MSG   ='cmd timeout';
        this.hdl_timeout =null;

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
            //console.log('receive: ', util.to_hex_string(this.buffer));
            let fr_type = this.buffer[0];
            this.emit('frame',{type:fr_type,buffer:this.buffer});
         
        }
    }

    //GET_DLOGIC_CARD_TYPE (0x3C)
    get_dlogic_card_type(){
            return new  Promise((resolve,reject)=>{
             
                let on_frame=(frame)=>{
                   
                    switch (frame.type) {
                        case  CODE.ERR_HEADER: /* No card */ 
                            let err_code = frame.buffer[1];
                            if(err_code==CODE.NO_CARD){
                                resolve({is_available:false,card_type:0,details:util.get_card_type_from_code(0)});
                            }else{
                                reject(frame);
                            }
                            break;
                        case CODE.RESPONSE_HEADER:/*have card */
                            let card_type =frame.buffer[4];
                            let resp={
                                is_available:true,
                                card_type:card_type,
                                details:util.get_card_type_from_code(card_type)
                            };
                            resolve(resp);
                            break;
                        default:
                            reject('invalid resp');
                            break;
                    }
                };
                //only fire ontime
                this.once('frame',on_frame);
    
               
                //GET_DLOGIC_CARD_TYPE (0x3C)
                this.send_command("55 3C AA 00 00 00 CA");
            });
    }
    //GET_CARD_ID_EX (0x2C)  : Use this function for cards with UID longer than 4 byte
    get_card_id_ex(){
        return new  Promise((resolve,reject)=>{
         
            let on_frame=(frame)=>{
              //  remove_listener();//remove to resever for next  time
             
                switch (frame.type) {
                    case  CODE.ERR_HEADER: /* No card */
                      
                        let err_code = frame.buffer[1];
                        if(err_code==CODE.NO_CARD){
                            resolve({is_available:false,uid_len:0,uid:''});
                        }else{
                            reject(frame);
                        }
                        break;
                    case CODE.RESPONSE_HEADER:/*have card */
                        let uid_len =frame.buffer[5];
                        let resp={
                            is_available:true
                        };
                        if(this.buffer.length >= (CODE.PACKET_LENGTH+uid_len)){
                            let uid_buffer =  new  Buffer.alloc(uid_len);
                            frame.buffer.copy(uid_buffer,0,7,7+uid_len);
                            resp.uid_len=uid_len;
                            resp.uid = util.to_hex_string(uid_buffer);
                            resolve(resp);
                        }
                        else{
                            reject('invalid resp');
                        }
                        break;
                    default:
                        reject('invalid resp');
                        break;
                }
            };
            this.once('frame',on_frame);//onetime fire

            //GET_CARD_ID_EX (0x2C)  : Use this function for cards with UID longer than 4 byte
            this.send_command("55 2C AA 00 00 00 DA");
        });
    }
    self_reset(){
        return new  Promise((resolve,reject)=>{
          
            let on_frame=(frame)=>{
               
                resolve('Reset OK');
            };
            this.once('frame',on_frame);
            //cmd SELF_RESET (0X30)
            this.send_command("55 30 AA 00 00 00 D6");
        });
    }
    get_reader_type(){
        return new  Promise((resolve,reject)=>{
  

            let on_frame=(frame)=>{
               
                //{type:fr_type,buffer:this.buffer}
                if(frame.type==CODE.RESPONSE_HEADER){
                    resolve(frame.buffer);
                }else{
                    reject(frame.buffer);
                }
            };
            this.once('frame',on_frame);
            //cmd GET_READER_TYPE (0x10)
            this.send_command("55 10 AA 00 00 00 F6");
        });
    }
    //GET_FIRMWARE_VERSION (0x29)
    get_firmware_version(){
        return new  Promise((resolve,reject)=>{
            let on_frame=(frame)=>{
                //{type:fr_type,buffer:this.buffer}
                if(frame.type==CODE.RESPONSE_HEADER){
                    let fw_version=frame.buffer[4].toString(10)+"."+frame.buffer[5].toString(10);
                    resolve(fw_version);
                }else{
                    reject(frame.buffer);
                }
            };
            this.once('frame',on_frame);
            //cmd GET_READER_TYPE (0x10)
            this.send_command("55 29 AA 00 00 00 DD");
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