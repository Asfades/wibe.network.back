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
}

export function editFilename(categoryName: FileCategories) {
  return function(req, file, callback) {
    const fileExtName = extname(file.originalname);
    const randomPart = uuid();
    const editedFilename = `${categoryName}-${randomPart}${fileExtName}`;
    req.on('close', removeUnuploadedFile(editedFilename, categoryName));
    callback(null, editedFilename);
  }
}

function removeUnuploadedFile(filename, categoryName) {
  return () => {
    let filepath = getFolder(categoryName);
    fs.promises.unlink(`${filepath}/${filename}`);
  }
}

export enum FileCategories {
  Avatars = 'avatars',
  Backgrounds = 'backgrounds',
  Audios = 'audios'
}

export function getFolder(fileCategory: FileCategories) {
  let filepath = './files/'
  switch (fileCategory) {
    case FileCategories.Avatars:
      filepath += 'profiles/avatars';
      break;
    case FileCategories.Backgrounds:
      filepath += 'profiles/backgrounds';
      break;
    case FileCategories.Audios:
      filepath += 'audios';
      break;
    default:
      return;
  }
  return filepath;
}
