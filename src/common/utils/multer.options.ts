
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from "@nestjs/common";



const createFolder = (folder: string) => {
    try {
        console.log('💾 Create a root uploads folder...');
        fs.mkdirSync(path.join(__dirname, '..', `uploads`));
    } catch (error) {
        console.log('The folder already exists...');
    }
    try {
        console.log(`💾 Create a ${folder} uploads folder...`);
        fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`));
    } catch (error) {
        console.log(`The ${folder} folder already exists...`);
    }
};


const storage = (folder: string): multer.StorageEngine => {
    createFolder(folder);
    return multer.diskStorage({

        destination(req, file, cb) {
            //* 어디에 저장할 지
            const folderName = path.join(__dirname, '..', `uploads/${folder}`);
            cb(null, folderName);
        },

        filename(req, file, cb) {
            //* 어떤 이름으로 올릴 지
            const ext = path.extname(file.originalname);
            const fileName = `${path.basename(
                file.originalname,
                ext,
            )}${Date.now()}${ext}`;
            cb(null, fileName);
        },
    });
};

const limits = {
    fileSize: 200000,
    files: 3
};

const fileFilter = (req, file, cb) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];
    const allowFileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if ( allowFileExtensions.includes(fileType)) {
        cb(null, true);
    } else {
        cb(new Error('jpg|jpeg|gif|png|webp extension only'), false);
    }
}

export const multerOptions = (folder: string) => {
    const result: MulterOptions = {
        storage: storage(folder),
        limits: limits,
        //fileFilter: fileFilter
    };
    return result;
};