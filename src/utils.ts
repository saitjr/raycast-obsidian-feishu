import { exec } from 'child_process';

export enum ECookieType {
  Chrome = 'chrome',
  Safari = 'safari'
}

export type TConfig = {
  referer: string;
  accountID: string;
}

export function getConfigByType(type: ECookieType): TConfig {
  if (type === ECookieType.Chrome) {
    return {
      referer: 'https://bytedance.feishu.cn/docs/doccn86hxDANn6yuDAKyta',
      accountID: "6631324782002438408",
    }
  }
  if (type === ECookieType.Safari) {
    return {
      referer: 'https://saitjr-blog.feishu.cn/docs/doccnea4gWvy9EH0mWMqsnW99Nb',
      accountID: "6851789326372601857",
    }
  }
  throw Error(`unsupport type = ${type}`)
}

export async function execCmd(cmd: string): Promise<string> {
  return new Promise((res, rej) => {
    exec(cmd, (error, stdout, _0) => {
      if (error) {
        rej(error.message);
        return;
      }
      res(stdout);
    });
  });
}