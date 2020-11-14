
var fs = require('fs');

function logger(filepath, message)
{
    fs.appendFile(filepath, `${message}\r\n`, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

}

module.exports = logger;