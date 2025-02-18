import { exportCsvToTxt } from './task-3-export-csv-to-txt';
import { WithTime } from './task-2-with-time';

// Test CSV to TXT export
const csvPath = './assets/books.csv';
const txtPath = './assets/books.txt';

exportCsvToTxt(csvPath, txtPath)
  .then(() => {
    console.log(`Export completed successfully. Check ${txtPath}.`);
  })
  .catch((error) => {
    console.error(`Export failed: ${error.message}`);
  });

// Test WithTime class with a sample async function
const withTimeInstance = new WithTime();
withTimeInstance.on('begin', () => console.log('Process started.'));
withTimeInstance.on('data', (data) => console.log('Data received:', data));
withTimeInstance.on('end', () => console.log('Process ended.'));
withTimeInstance.on('error', (error) => console.error('Error:', error.message));

// Sample asynchronous function for testing
const sampleAsyncFunction = (url: string, callback: (err: Error | null, data?: any) => void) => {
  setTimeout(() => {
    callback(null, `Processed URL: ${url}`);
  }, 2000);
};

withTimeInstance.execute(sampleAsyncFunction, 'http://google.com');
