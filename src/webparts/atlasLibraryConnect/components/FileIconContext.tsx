import * as React from 'react';
// import excel from "../../../assets/icons/excel.png";
// import word from "../../../icons/word.png";
// import pdf from "../../../assets/icons/pdf.png";
// import powerpoint from "../../../assets/icons/powerpoint.png";
// import image from "../../../assets/icons/image.png";
// import video from "../../../assets/icons/video.png";
// import other from "";
const excel = require('../../../icons/excel.png');
const word = require('../../../icons/word.png');
const pdf = require('../../../icons/pdf.png');
const powerpoint = require('../../../icons/powerpoint.png');
const image = require('../../../icons/image.png');
const video = require('../../../icons/video.png');
const other = require('../../../icons/other.png');

const FileIconContext = React.createContext({
  excelIcon: excel,
  docxIcon: word,
  powerpointIcon: powerpoint,
  pdfIcon:pdf,
  imageIcon:image,
  videoIcon:video,
  otherIcon:other

});
export default FileIconContext;


