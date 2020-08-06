import { extname } from 'path'; 
import * as fs from 'fs';

export function audioFileFilter(req, file, callback) {
  if (!file.originalname.match(/\.(mp3|mp4|flac)$/)) {
    return callback(new Error('Only audio files are allowed!'), false);
  }
  callback(null, true);
};

export function editFileName(req, file, callback) {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const editedFilename = `${name}-${randomName}${fileExtName}`;
  req.on('close', removeUnuploadedFile(editedFilename));
  callback(null, editedFilename);
};

function removeUnuploadedFile(filename) {
  return () => {
    console.log('request closed, ', filename);
    fs.promises.unlink(`./audio-tracks/${filename}`);
  }
}
