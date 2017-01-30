//var csv is the CSV file with headers
const csvToJson = ({ csvString, rowSeparator = '\n', columnSeparator = ';'}) => {
  const lines = csvString.split(rowSeparator);
  const headers = lines.splice(0, 1)[0].split(columnSeparator);

  //return result; //JavaScript object
  return lines.map(line => {
    const obj = {};
    const currentLine = line.split(columnSeparator);

    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentLine[j];
    }

    return obj;
  });
};

export default csvToJson;
