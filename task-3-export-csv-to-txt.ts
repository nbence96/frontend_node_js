import * as fs from 'fs';
import csvtojson from 'csvtojson';
/**
 * Exports a CSV file to a TXT file.
 * CSV format:
 *  Book;Author;Amount;Price
 *  The Compound Effect;Darren Hardy;5;9,48
 * TXT format: {"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
 * @param {string} csvPath - The path to the source CSV file.
 * @param {string} txtPath - The path to the destination TXT file.
 * @returns {Promise<boolean>} - A promise that resolves to true when export is done.
 */
export const exportCsvToTxt = (csvPath: string, txtPath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const csvStream = fs.createReadStream(csvPath);
    const txtStream = fs.createWriteStream(txtPath);
    
    const csvConverter = csvtojson({
      delimiter: ';',
      checkType: true,
      colParser: {
        'Price': (item) => parseFloat(item.replace(',', '.'))
      }
    });

    csvStream.on('error', reject);
    txtStream.on('error', reject);
    txtStream.on('finish', () => resolve(true));

    csvStream
      .pipe(csvConverter)
      .on('data', (data) => {
        const jsonData = JSON.parse(data.toString());
        const formattedData = {
          book: jsonData.Book,
          author: jsonData.Author,
          price: jsonData.Price
        };
        txtStream.write(JSON.stringify(formattedData) + '\n');
      })
      .on('end', () => {
        txtStream.end();
      });
  });
};
