import fs from "fs";
import path from "path";
import { Moment } from "moment-timezone";
import { isNull } from "../utils";

export class Obsidian {
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  async createFile(dir: string, name: string, ln?: string[], content?: string): Promise<string> {
    const fullPath = this.getAbsolutePath(path.join(dir, name));
    const validLn = ln === undefined ? undefined : ln.map((l) => this.getAbsolutePath(l));

    if (!fullPath.endsWith(".md")) {
      throw Error(`create fail, error ob path - ${fullPath}`);
    }
    if (await this.isFileEixst(fullPath)) {
      throw Error(`已存在同名文件 - ${fullPath}`);
    }

    const fullDir = path.dirname(fullPath);
    if (!(await this.isFileEixst(fullDir))) {
      await fs.promises.mkdir(fullDir, { recursive: true });
    }
    await fs.promises.writeFile(fullPath, content ?? "", "utf8");
    if (validLn) {
      for (const linkDir of validLn) {
        await fs.promises.link(fullPath, path.join(linkDir, name));
      }
    }

    console.log(`完成 ob 文件创建 - ${fullPath}`);
    return fullPath;
  }

  async writeDailyNote(date: Moment, note: string) {
    const dailyNotePath = this.getDailyNotePath(date);
    const isExist = await this.isFileEixst(dailyNotePath);
    if (!isExist) {
      await fs.promises.writeFile(dailyNotePath, "", "utf8");
    }
    const content = await this.readDailyNote(date);
    if (isNull(content) || content === "-") {
      await fs.promises.appendFile(dailyNotePath, ` ${note}`);
      return;
    }
    await fs.promises.appendFile(dailyNotePath, `\n- ${note}`);
  }

  async readDailyNote(date: Moment): Promise<string | undefined> {
    const dailyNotePath = this.getDailyNotePath(date);
    const isExist = await this.isFileEixst(dailyNotePath);
    if (!isExist) {
      return;
    }
    const content = await fs.promises.readFile(dailyNotePath);
    return content.toString();
  }

  private getDailyNotePath(date: Moment): string {
    const fileName = date.format("YYYY_MM_DD") + ".md";
    const dailyNotePath = path.join(this.getJournalsDir(), fileName);
    return dailyNotePath;
  }

  getIFrameSnip(link: string): string {
    return `<div style="display:block; postion: absolute;left:0;top:0;width:100%;height:1200;"><iframe src="${link}" style="display:block; postion: absolute;left:0;top:0;width:100%;height:100%;" allow="fullscreen" border=0 frameborder=0></iframe></div>`;
  }

  getJournalsDir() {
    return path.join(this.root, "journals");
  }

  private async isFileEixst(filepath: string): Promise<boolean> {
    try {
      await fs.promises.access(filepath);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getAbsolutePath(relativePath: string): string {
    return relativePath.startsWith("/Users") ? relativePath : path.join(this.root, relativePath);
  }
}
