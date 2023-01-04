import { ECookieType, execCmd } from '../utils';

export class Cookie {
  private type: ECookieType

  constructor(type: ECookieType) {
    this.type = type
  }

  // 传 feishu.cn
  async getCookieMap(host: string): Promise<{ [key: string]: string } | undefined> {
    if (this.type === ECookieType.Chrome) {
      const uri = `https://${host}`
      const cmd = `python3 '${__dirname}/assets/ChromeCookieReader.py' ${uri}`
      const output = await execCmd(cmd)
      return JSON.parse(output)
    }
    if (this.type === ECookieType.Safari) {
      const cmd = `python3 '${__dirname}/assets/BinaryCookieReader.py' ~/Library/Cookies/Cookies.binarycookies ${host}`
      const output = await execCmd(cmd)
      return JSON.parse(output)
    }
    throw new Error(`unsupport type = ${this.type}`);
  }

  async getCookie(host: string): Promise<string | undefined> {
    const cookieMap = await this.getCookieMap(host)
    if (cookieMap === undefined) return
    const cookieArray = []
    for (const key of Object.keys(cookieMap)) {
      const str = `${key}=${cookieMap[key]}`
      cookieArray.push(str)
    }
    return cookieArray.join(';')
  }
}



