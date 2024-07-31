import reader, { parseData } from './src/rfid.js';

reader.on('data', data => {
  const userId = parseData(data);
  console.log('userId', userId);
});
