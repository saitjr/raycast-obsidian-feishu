import { execAppleScript, isNull } from "../utils";

// export type TCatchWebsiteInfo = {
//   url: string;
//   title: string;
// };

export interface TCatchWebsiteInfo {
  url: string;
  title: string;
}

export default class Reader {
  async catchWebsite(): Promise<TCatchWebsiteInfo | undefined> {
    const path = "/Users/tangjiarong/Documents/raycast/raycast-obsidian-feishu/src/reader/chrome.scpt";
    const res = await execAppleScript(path);
    const [websiteURL, websiteTitle] = res.split("\n");
    // const websiteURL = splited[0];
    // const title = splited[1];

    if (isNull(websiteTitle) || isNull(websiteURL)) {
      return;
    }
    return {
      url: websiteURL,
      title: websiteTitle,
    };
  }
}
