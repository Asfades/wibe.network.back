import { extname } from 'path'; 
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

export function filetypeFilter(typeRegex) {
  return function(req, file, callback) {
    if (!file.originalname.match(typeRegex)) {
      return callback(new Error('Only audio files are allowed!'), false);
    }
    callback(null, true);
  }
};

export function editFilename(req, file, callback) {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomPart = uuid();
  const editedFilename = `${name}-${randomPart}${fileExtName}`;
  req.on('close', removeUnuploadedFile(editedFilename));
  callback(null, editedFilename);
};

function removeUnuploadedFile(filename) {
  return () => {
    console.log('request closed, ', filename);
    fs.promises.unlink(`./audio-tracks/${filename}`);
  }
}
