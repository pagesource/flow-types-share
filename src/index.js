const fs = require('fs');
const path = require('path');

const replaceRegex = /{{DYNAMIC_IGNORE}}/g;
const exclusionPattern = /^\[exclusion\]([^[]*)$/gm;

module.exports = function flowConfigGenerate({templatePath = '.flowconfig.template', folderPath= 'node_modules', outputPath = './'}){

  return new Promise((resolve,reject)=>{
     fs.readFile(templatePath, 'utf8', function(err, existingData) {
      if (err) {
        console.error(err);
        process.exit(1);
        reject();
      }
      const exclusionArray = exclusionPattern.exec(existingData);
      let  exclusionList = [];
      let template = existingData;
      if(exclusionArray && exclusionArray.length > 0){
        exclusionList = exclusionArray[1].split(/\r?\n/).filter(function(item){return item;});
        template = existingData.replace(exclusionPattern,'');
      }

      fs.readdir(folderPath, function(err, items) {
        if (err) {
          console.log(err);
          process.exit(1);
          reject();
        }
        const data = items
          .filter(function(item) {
            return !exclusionList.includes(item);
          })
          .map(function(item) {
            return '.*/' + folderPath + '/' + item + '/.*';
          })
          .join('\n');

          const result = template.replace(replaceRegex, data);
          fs.writeFile(path.join(outputPath,'.flowconfig'), result, err => {
            if (err){
              console.error(err);
              process.exit(1);
              reject();
            };
            console.log('.flowconfig has been generated!');
            resolve();
          });
      });
    });
  })
}




