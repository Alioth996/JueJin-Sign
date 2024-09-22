const { decodeQR, generateQRtoTerminal, pushWechatMsg, getCurPoint, getRandomTime } = require("./utils");
// const data = getCurPoint()

// data.then(data => console.log(data))

// const time = getRandomTime()

// console.log(time)


const testWXMsg = async () => {
    const { data, code } = await pushWechatMsg({
        checkin: "已签到",
        point: "1",
        curPonit: "1",
        userName: "test"
    })

    console.log(data)
}

testWXMsg()
