// let urfReader =  require("./utils");
// var buf = new Buffer.from([0x55, 0x11, 0xAA, 0x00,0x00, 0x00]);
// console.log(urfReader.crc_calc(buf).toString(16))

const EventEmitter = require('events').EventEmitter;
const SerialPort = require('serialport');
const DlogicReader = require('./DlogicReader');
const ndef = require('ndef');
const timeout = require('await-timeout');

const port = new SerialPort('/dev/cu.usbserial-A62NZGPJ', {
  //const port = new SerialPort('/dev/cu.usbserial-AL00FN6X', {
  baudRate: 1000000,/** 1Mbs */
  rtscts: false,
  autoOpen: true,
});

const reader_hdl = new EventEmitter();
let reader = new DlogicReader(port);
reader.clear_rx_cache();


let messages = [
  ndef.uriRecord('http://www.google.com/qwertyuiopasdsfghjhgfdsfghgdfstdrghkjlkjhkjl'),
  ndef.textRecord('12345678901234567890123456789012345678901234567890abcdefighklmn')
];
let data = ndef.encodeMessage(messages);

const gap_cmd_time = 80;//100ms
let t = Date.now();
let lasttime = t;
let last = ''

reader.on('ready', async (msg) => {
  console.log(msg);
  reader.clear_rx_cache();
  reader_hdl.removeAllListeners('next_scan');//remove all listener before

  reader_hdl.on('next_scan', async (msg) => {
    try {
      let res = await reader.get_card_id_ex();
      if (res.is_available) {
        if (last !== res.uid) {
          let t = Date.now();
          dt = t - lasttime;
          lasttime = t;
          console.log(dt, res);
          last = res.uid;
          let resp = await reader.linear_write_PK(data, 0);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      reader_hdl.emit('next_scan', 'next tag');
    }, gap_cmd_time);

  })

  reader_hdl.emit('next_scan');


})
