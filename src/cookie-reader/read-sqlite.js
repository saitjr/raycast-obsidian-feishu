const sqlite3 = require('sqlite3')
const url = require('url')

exports.readURICookieFromDB = (uri) => {
  const dbPath = process.env.HOME + `/Library/Application Support/Google/Chrome/Default/Cookies`

  const parsedUrl = url.parse(uri);
  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    return null
  }

  const db = new sqlite3.Database(dbPath);
  const encryptedValues = {}

  return new Promise((resolve, reject) => {
      db.all("SELECT host_key, path, is_secure, expires_utc, name, value, encrypted_value, creation_utc, is_httponly, has_expires, is_persistent FROM cookies where host_key like '%" + parsedUrl.hostname + "' ORDER BY LENGTH(path) DESC, creation_utc ASC", (err, rows) => {
      if (err) {
        db.close()
        reject(err)
      }
      for (const res of rows) {
        if (res.value === '' && res.encrypted_value.length > 0) {
          const name = res.name
          const value = res.encrypted_value
          encryptedValues[name] = value
        }
      }
      db.close()
      resolve(encryptedValues)
    })
  })
}

exports.readURICookieFromDB('https://feishu.cn').then(d => console.log(d))