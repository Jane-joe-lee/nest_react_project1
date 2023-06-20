// 업로드 가능한 이미지 확장자명
//export const allowImgFile = 'png,jpg,jpeg,gif,webp';

// 파일 확장자 구하기 ( filename: 파일명 )
export function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// 파일 MIME 타입 구하기 ( file: 객체 )
export function getFileMIMEType(file) {
    return file.type.startsWith('image/');
}