import bwipjs from "bwip-js";

export const generateBarcodeBase64 = (orderId) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: orderId,
        scale: 3,
        height: 10,
        includetext: true,
      });

      resolve(canvas.toDataURL("image/png"));
    } catch (err) {
      reject(err);
    }
  });
};

// const generateBarcodeBase64 = (text) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const canvas = document.createElement("canvas");
//       bwipjs.toCanvas(canvas, {
//         bcid: "code128",
//         text,
//         scale: 3,
//         height: 10,
//         includetext: true,
//         textxalign: "center",
//       });
//       resolve(canvas.toDataURL("image/png"));
//     } catch (err) {
//       reject(err);
//     }
//   });
// };
