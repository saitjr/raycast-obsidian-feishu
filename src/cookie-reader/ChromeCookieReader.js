// https://github.com/n8henrie/pycookiecheat
// https://github.com/bertrandom/chrome-cookies-secure/blob/e04db39a03cdde5912712fd1f659b68fe0af5ea3/index.js
// https://www.jianshu.com/p/c94363c33bae

// npm install sqlite3 keychain

const crypto = require('crypto')
const sqlite3 = require('sqlite3')
const url = require('url')
const keychain = require('keychain')

const SALT = new Buffer.from('saltysalt', 'binary');
const LENGTH = 16
const iv = new Buffer.from(new Array(LENGTH + 1).join(' '), 'binary');
const ITERATIONS = 1003

const chromeDecrypt = (encryptedValue, password) => {
  encryptedValue = encryptedValue.slice(3)

  const key = crypto.pbkdf2Sync(password, SALT, ITERATIONS, LENGTH, 'sha1');
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

  decipher.setAutoPadding(false);
  decoded = decipher.update(encryptedValue);
  final = decipher.final();
  final.copy(decoded, decoded.length - 1);
  padding = decoded[decoded.length - 1];
  if (padding) {
    decoded = decoded.slice(0, decoded.length - padding);
  }
  decoded = decoded.toString('utf8');
  return decoded
}

const readURICookieFromDB = (uri) => {
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

const readChromePassword = async () => {
  const service = 'Chrome Safe Storage'
  const account = 'Chrome'
  // const password = await keychain.getPassword(service, account)
  return new Promise((resolve, reject) => {
    keychain.getPassword({ account, service }, function(err, pass) {
      if (err) {
        reject(err)
        return
      }
      resolve(pass)
    });
  })
}

const getCookie = async (uri) => {
  const encryptedCookies = await readURICookieFromDB(uri)
  const password = await readChromePassword()
  if (encryptedCookies === undefined || encryptedCookies === null) {
    return {}
  }
  const result = {}
  for (const key of Object.keys(encryptedCookies)) {
    const value = chromeDecrypt(encryptedCookies[key], password)
    result[key] = value
  }
  return result
}

module.exports = getCookie
