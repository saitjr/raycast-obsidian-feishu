import { getAssetFilePath } from "../utils";
import { FeishuDocBase } from "./base";

export enum EDriveType {
  DocX = 22,
}

export type TFindItem = {
  token: string; // 'doxcnU8rekxAy8FuxWZnXkBHuhe',
  type: EDriveType; // 22,
  title: string; // '[UISC] TikTok Beta <em>Test</em>ing Program//众测线上化',
  preview: string; // 'page and click &#34;Join Beta <em>Test</em> Program&#34;.  If users want to leave Beta <em>Test</em>, they  page, view and participate in the beta <em>test</em>',
  owner_id: string; // '7002790163210305537',
  open_time: number; // 1665383383,
  edit_uid: string; // '7002790163210305537',
  edit_time: number; // 1670835626,
  edit_name: string; // '安映雪',
  comment: string; // '',
  author: string; // '安映雪',
  create_uid: string; // '7002790163210305537',
  is_external: false;
  url: string; // 'https://bytedance.feishu.cn/docx/doxcnU8rekxAy8FuxWZnXkBHuhe',
  subtype: string; // '0',
  user_edit_time: number; // 0,
  share_version: number; // 0,
  wiki_infos: {
    wiki_token: string;
  }[]; // null
  owner_type: number; // 5,
  container_type: number; // 5
  icon_path: string;
};

export class FeishuDoc extends FeishuDocBase {
  async create(name: string): Promise<string> {
    const host = this.getRefererHost();
    const url = `https://${host}/space/api/explorer/create/`;
    const params = {
      type: 22,
      name,
    };
    const res = await this.formPost<any>(url, params);
    return res.data.url;
  }

  async find(query: string, needEm = true): Promise<TFindItem[]> {
    if (query === undefined || query === null || query.length === 0) return [];
    const host = this.getRefererHost();
    const url = `https://${host}/space/api/search/refine_search/?query=${encodeURIComponent(
      query
    )}&offset=0&count=12&obj_types=2%2C3%2C8%2C11%2C12%2C15%2C22%2C0%2C111&owner_id=&chat_id=&group_id=&folder_tokens=&open_time=&file_type=&sort_rule=0&need_path=0&search_quick_access=false&source=web&config_source=0&container_type=1`;
    type TFindResponse = {
      data: {
        entities: { objs: TFindItem[] };
        tokens: string[];
      };
    };
    const res = await this.get<TFindResponse>(url);
    const entities = Object.values(res.data.entities.objs);
    const sortedTokens = res.data.tokens;
    const docs = this.sortByOriginalOrder(entities, sortedTokens);
    for (const doc of docs) {
      if (doc.url.length === 0 && doc.wiki_infos !== undefined && doc.wiki_infos.length > 0) {
        doc.url = `https://${host}/wiki/${doc.wiki_infos[0].wiki_token}`;
      }
    }
    if (!needEm) {
      docs.forEach((d) => (d.title = d.title.replaceAll("<em>", "").replaceAll("</em>", "")));
    }
    // 拼接图标
    docs.forEach((d) => (d.icon_path = this.getIconPathByURL(d.url)));

    return docs;
  }

  private getIconPathByURL(url: string): string {
    let iconName = "unknonw.svg";
    if (url.includes("/wiki/")) {
      iconName = "wiki.svg";
    }
    if (url.includes("/docx/") || url.includes("/docs/")) {
      iconName = "doc.svg";
    }
    if (url.includes("/sheet/")) {
      iconName = "sheet.svg";
    }
    if (url.includes("/base/")) {
      iconName = "bitable.svg";
    }
    return getAssetFilePath(`/larksuit/${iconName}`);
  }

  private sortByOriginalOrder(docs: TFindItem[], sortedTokens: string[]): TFindItem[] {
    const sorted = [];
    for (const token of sortedTokens) {
      const doc = docs.find((d) => d.token === token);
      if (doc === undefined) continue;
      sorted.push(doc);
    }
    return sorted;
  }
}
