import request from 'request';
import { Cookie } from '../cookie-reader/cookie';
import { ECookieType, getConfigByType } from '../utils';
import urlParser from 'url'

export class FeishuDocBase {

  protected cookieType: ECookieType
  private host = 'feishu.cn'

  constructor(type: ECookieType) {
    this.cookieType = type
  }

  getRefererHost(): string {
    return urlParser.parse(getConfigByType(this.cookieType).referer).host ?? ''
  }

  async get<T>(url: string): Promise<T> {
    const cookie = new Cookie(this.cookieType)
    const cookieString = await cookie.getCookie(this.host)
    const headers = {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,nl;q=0.5",
      "content-type": "application/x-www-form-urlencoded",
      "context": "request_id=EJBCEnHiAfmE-6631324782002438408;os=mac;app_version=1.0.4.680;os_version=10.15.7;platform=web",
      "doc-biz": "Lark",
      "doc-os": "mac",
      "doc-platform": "web",
      "referer": getConfigByType(this.cookieType).referer,
      "cookie": cookieString
    }
    const options = {
      method: 'GET',
      url,
      headers
    };
    return new Promise((res, rej) => {
      request(options, function (err: unknown, response: { body: string; }) {
        if (!err) {
          const body = JSON.parse(response.body);
          res(body);
        } else {
          rej(err);
        }
      });
    })
  }

  async formPost<T>(url: string, params?: object): Promise<T> {
    const cookie = new Cookie(this.cookieType)
    const [
      cookieString,
      cookieMap
    ] = await Promise.all([
      cookie.getCookie(this.host),
      cookie.getCookieMap(this.host),
    ])
    if (cookieMap === undefined) {
      throw new Error(`get cookie error, type = ${this.cookieType}`);
    }
    const csrftoken = cookieMap['_csrf_token']
    const headers = {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,nl;q=0.5",
      "content-type": "application/x-www-form-urlencoded",
      "context": "request_id=EJBCEnHiAfmE-6631324782002438408;os=mac;app_version=1.0.4.680;os_version=10.15.7;platform=web",
      "doc-biz": "Lark",
      "doc-os": "mac",
      "doc-platform": "web",
      "referer": getConfigByType(this.cookieType).referer,
      'x-csrftoken': csrftoken,
      "cookie": cookieString
    }
    const options = {
      'method': 'POST',
      url,
      headers,
      form: params
    };
    return new Promise((res, rej) => {
      request(options, (err: unknown, response: { body: string; }) => {
        if (!err) {
          const body = JSON.parse(response.body);
          res(body);
        } else {
          rej(err);
        }
      });
    });
  }
}

// const getCookieMapByRequestURL = async (url) => {
//   const browserType = getBrowserTypeByURL(url)
//   if (browserType === 'chrome') {
//     return _cookie.getChromeCookieMap()
//   }
//   if (browserType === 'safari') {
//     return _cookie.getSafariCookieMap()
//   }
  
// }


// const getBrowserTypeByURL = (url) => {
//   const requstHost = parse(url).host
//   if (_config.chromeLink.includes(requstHost)) {
//     return 'chrome'
//   }
//   return 'safari'
// }

// const getOwnerAccountByBrowserType = (browserType) => {
//   if (browserType === 'chrome') {
//     return _config.chromeAccountID
//   }
//   return _config.safariAccountID
// }
