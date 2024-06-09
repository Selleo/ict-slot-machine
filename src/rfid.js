import { SerialPort, ReadlineParser } from 'serialport'

export const parseData = data => {
  return parseInt(data.replace(/[^0-9A-Fa-f]+/g, ''), 16).toString()
}

const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = new ReadlineParser({ delimiter: '\n', encoding: 'ASCII' })
const reader = port.pipe(parser)

export default reader
