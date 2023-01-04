import { FeishuDocBase } from './base'

export class FeishuDoc extends FeishuDocBase {
  
  async create() {
    const host = this.getRefererHost()
    const url = `https://${host}/space/api/explorer/create/`
    const params = {
      type: 2
    }
    const res = await this.formPost<any>(url, params)
    return res.data.url
  }

  async find(query: string) {
    const host = this.getRefererHost()
    const url = `https://${host}/space/api/search/refine_search/?query=${encodeURIComponent(query)}&offset=0&count=12&obj_types=2%2C3%2C8%2C11%2C12%2C15%2C22%2C0%2C111&owner_id=&chat_id=&group_id=&folder_tokens=&open_time=&file_type=&sort_rule=0&need_path=0&search_quick_access=false&source=web&config_source=0&container_type=1`
    const res = await this.get<any>(url)
    const entities = Object.values(res.data.entities.objs)
    const sortedTokens = res.data.tokens
    const docs = this.sortByOriginalOrder(entities, sortedTokens)
    for (const doc of docs) {
      if (doc.url.length === 0 && doc.wiki_infos !== undefined && doc.wiki_infos.length > 0) {
        doc.url = `https://${host}/wiki/${doc.wiki_infos[0].wiki_token}`
      }
    }
    return docs
  }

  private sortByOriginalOrder(docs: any[], sortedTokens: string[]) {
    const sorted = []
    for (const token of sortedTokens) {
      const doc = docs.find(d => d.token === token)
      if (doc === undefined) continue
      sorted.push(doc)
    }
    return sorted
  }
}
