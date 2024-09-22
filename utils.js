const Jimp = require("jimp");
const jsQR = require("jsqr");
const QRCode = require("qrcode");
const axios = require('axios');


require('dotenv').config();


// 解析二维码
const decodeQR = async (path) => {
    const image = await Jimp.read(path);

    const imageData = {
        data: new Uint8ClampedArray(image.bitmap.data),
        width: image.bitmap.width,
        height: image.bitmap.height,
    };

    const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

    if (!decodedQR) {
        throw new Error("未找到二维码");
    }

    return decodedQR.data;
};
// 生成二维码
const generateQRtoTerminal = (text) => {
    return QRCode.toString(
        text,
        { type: "terminal", errorCorrectionLevel: 'L', version: 7 },
        function (err) {
            if (err) throw err;
        }
    );
};

// 第三方接口限制  5次/分钟 相同消息 3条/小时
const pushWechatMsg = (message) => {
    const { point, curPonit, checkin, userName } = message
    var data = JSON.stringify({
        "token": process.env.PushPulsToken || 'b4d00fe367fc4239847ca78b3ace8c80',
        "title": "掘金签到通知",
        "content":
            `
            <p>签到状态: <span style="color: #1abc9c;">${checkin} √</span></p>
            <p>掘金账号: <span style="color: #2d3436;">${userName}</span></p>
            <p>获得矿石: <span style="color: #3498db;">${point}</span></p>
            <p>矿石总数: <span style="color: #2c3e50;">${curPonit}</span></p>
        `,

        "template": "html"
    });

    var config = {
        method: 'post',
        url: 'https://www.pushplus.plus/send',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
            'Content-Type': 'application/json'
        },
        data: data
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error)
            });
    })

}
const getCurPoint = async () => {
    var config = {
        method: 'get',
        url: 'https://api.juejin.cn/growth_api/v1/get_cur_point',
        headers: {
            'Cookie': '_tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227375020822899738162%2522%252C%2522user_unique_id%2522%253A%25227375020822899738162%2522%252C%2522timestamp%2522%253A1717130857185%257D; n_mh=VhSvSe1Kqdv21URHsx7mhxnio1YOjcYFGu1rQI2CPxc; sid_guard=5661e4f2a136b308013198b6c00c278f%7C1717600240%7C31536000%7CThu%2C+05-Jun-2025+15%3A10%3A40+GMT; uid_tt=cc00fac1ec2d4b2b7f6e284c95f10f19; uid_tt_ss=cc00fac1ec2d4b2b7f6e284c95f10f19; sid_tt=5661e4f2a136b308013198b6c00c278f; sessionid=5661e4f2a136b308013198b6c00c278f; sessionid_ss=5661e4f2a136b308013198b6c00c278f; sid_ucp_v1=1.0.0-KDM3NGY5YTU3OTJiZjA5ZDE0N2QzOTI0Y2U2NjQ1NGI2NTRiMjVhYmUKFwiHyMDKxYy3BBDw_4GzBhiwFDgHQPQHGgJsZiIgNTY2MWU0ZjJhMTM2YjMwODAxMzE5OGI2YzAwYzI3OGY; ssid_ucp_v1=1.0.0-KDM3NGY5YTU3OTJiZjA5ZDE0N2QzOTI0Y2U2NjQ1NGI2NTRiMjVhYmUKFwiHyMDKxYy3BBDw_4GzBhiwFDgHQPQHGgJsZiIgNTY2MWU0ZjJhMTM2YjMwODAxMzE5OGI2YzAwYzI3OGY; store-region=cn-gd; store-region-src=uid; csrf_session_id=6bb5a9fdd498ac0091ac4bf41aa75601',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
            'Accept': '*/*',
            'Host': 'api.juejin.cn',
            'Connection': 'keep-alive'
        }
    };

    const res = await axios(config)
    return res.data
}

function getRandomTime() {
    // 生成随机的小时、分钟和秒
    let hours = Math.floor(Math.random() * 24);
    let minutes = Math.floor(Math.random() * 60);
    let seconds = Math.floor(Math.random() * 60);

    // 将它们格式化为两位数的字符串
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}



module.exports = {
    decodeQR,
    generateQRtoTerminal,
    pushWechatMsg,
    getCurPoint,
    getRandomTime
};
