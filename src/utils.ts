import { exec } from "child_process";
import moment, { Moment } from "moment-timezone";
import fs from "fs";
import _ from "lodash";
import { environment } from "@raycast/api";
import path from "path";

export enum ECookieType {
  Chrome = "chrome",
  Safari = "safari",
}

export type TConfig = {
  referer: string;
  accountID: string;
};

export function getConfigByType(type: ECookieType): TConfig {
  if (type === ECookieType.Chrome) {
    return {
      referer: "https://bytedance.feishu.cn/docs/doccn86hxDANn6yuDAKyta",
      accountID: "6631324782002438408",
    };
  }
  if (type === ECookieType.Safari) {
    return {
      referer: "https://saitjr-blog.feishu.cn/docs/doccnea4gWvy9EH0mWMqsnW99Nb",
      accountID: "6851789326372601857",
    };
  }
  throw Error(`unsupport type = ${type}`);
}

export function getObsidianRoot(): string {
  return "/Users/tangjiarong/Library/Mobile Documents/iCloud~is~workflow~my~workflows/Documents/logseq/";
}

export async function execCmd(cmd: string): Promise<string> {
  return new Promise((res, rej) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exec(cmd, (error, stdout, _0) => {
      if (error) {
        rej(error.message);
        return;
      }
      res(stdout);
    });
  });
}

export function today(): Moment {
  return moment().tz("Asia/Shanghai");
}

export async function execAppleScript(path: string): Promise<string> {
  const scriptContent = await fs.promises.readFile(path);
  const cmd = `osascript -e '${scriptContent}'`;
  const res = await execCmd(cmd);
  return res;
}

/**
 * 判断传入参数是否为 undefined/null/empty
 *
 * @export
 * @param {*} value
 * @return {boolean} 是否为空
 */
export function isNull(value: unknown): boolean {
  if (_.isNumber(value)) {
    return false;
  }
  if (_.isBoolean(value)) {
    return false;
  }
  if (_.isDate(value)) {
    return false;
  }
  if (_.isUndefined(value)) {
    return true;
  }
  if (_.isNull(value)) {
    return true;
  }
  if (_.isEmpty(value)) {
    return true;
  }
  return false;
}

/**
 * delay
 *
 * @export
 * @param {number} ms
 */
export async function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * 获取资源文件绝对路径
 *
 * @export
 * @param {string} relativePath
 * @return {*}  {string}
 */
export function getAssetFilePath(relativePath: string): string {
  return path.join(environment.assetsPath, relativePath);
}
