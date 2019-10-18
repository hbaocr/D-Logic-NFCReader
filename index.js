// let urfReader =  require("./utils");
// var buf = new Buffer.from([0x55, 0x11, 0xAA, 0x00,0x00, 0x00]);
// console.log(urfReader.crc_calc(buf).toString(16))


const DlogicReader = require('./DlogicReader');
const SerialPort = require('serialport');

const port = new SerialPort('/dev/cu.usbserial-A62NZGPJ', {
  //const port = new SerialPort('/dev/cu.usbserial-AL00FN6X', {
  baudRate: 1000000,/** 1Mbs */
  rtscts: false,
  autoOpen: true,
});


let reader = new DlogicReader(port);
reader.clear_rx_cache();



reader.on('ready', async (msg) => {
  console.log(msg);
  //reader.clear_rx_cache();
  //reader.send_command(new Buffer.from([0x55, 0x10, 0xAA, 0x00, 0x00, 0x00, 0xF6]))
  //reader.send_command("55 10 AA 00 00 00 F6");
  //let res = await reader.get_reader_type();
  let last = ''
  setInterval(async () => {

    let res = await reader.get_firmware_version();
    console.log(res);
    if (res.is_available) {
      console.log(res);
    }
  


  }, 1000);

})
