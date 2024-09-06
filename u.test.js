const { decodeQR, generateQRtoTerminal, pushWechatMsg, getCurPoint } = require("./utils");
const data = getCurPoint()

data.then(data => console.log(data))