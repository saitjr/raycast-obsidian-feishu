const getCookie = require('./ChromeCookieReader')

const argvs = process.argv
const host = argvs[2]

getCookie(host).then(data => {
    console.log(JSON.stringify(data))
})