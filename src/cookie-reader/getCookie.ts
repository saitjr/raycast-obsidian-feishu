// https://github.com/n8henrie/pycookiecheat
// https://github.com/bertrandom/chrome-cookies-secure/blob/e04db39a03cdde5912712fd1f659b68fe0af5ea3/index.js
// https://www.jianshu.com/p/c94363c33bae

// npm install sqlite3 keytar

import { pbkdf2Sync, createDecipheriv } from 'crypto';
import { Database } from 'sqlite3';
import { parse } from 'url';
// import { getPassword } from 'keytar';
import keychain from 'keychain'

const SALT = Buffer.from('saltysalt', 'binary');
const LENGTH = 16
const iv = Buffer.from(new Array(LENGTH + 1).join(' '), 'binary');
const ITERATIONS = 1003

function chromeDecrypt(encryptedValue: string, password: string): string {
  encryptedValue = encryptedValue.slice(3)

  const key = pbkdf2Sync(password, SALT, ITERATIONS, LENGTH, 'sha1');
  const decipher = createDecipheriv('aes-128-cbc', key, iv);

  decipher.setAutoPadding(false);
  const decoded = decipher.update(<NodeJS.ArrayBufferView><unknown>encryptedValue);
  const final = decipher.final();
  final.copy(decoded, decoded.length - 1);
  const padding = decoded[decoded.length - 1];
  if (padding) {
    return decoded.slice(0, decoded.length - padding).toString('utf8');
  }
  return decoded.toString('utf8');
}

async function readURICookieFromDB(uri: string): Promise<{ [key: string]: string } | undefined> {
  const dbPath = process.env.HOME + `/Library/Application Support/Google/Chrome/Default/Cookies`

  const parsedUrl = parse(uri);
  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    return undefined
  }

  const db = new Database(dbPath);
  const encryptedValues: { [key: string]: string } = {}

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

async function readChromePassword(): Promise<string | undefined> {
  const service = 'Chrome Safe Storage'
  const account = 'Chrome'
  // // const password = await getPassword(service, account)
  // // const password = await keychain.getPassword()
  // if (password === undefined || password === null) {
  //   return undefined
  // }
  // return password
  return new Promise((resolve, reject) => {
    keychain.getPassword({ account, service }, function(err: unknown, pass: string | PromiseLike<string | undefined> | undefined) {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      console.log('Password is', pass);
      resolve(pass)
      
    });
  })
  
  
}

export async function getCookie(uri: string): Promise<{[key: string]: string}> {
  const [encryptedCookies, password] = await Promise.all([
    readURICookieFromDB(uri),
    readChromePassword()
  ]) 
  if (password === undefined) {
    throw new Error(`cookie read fail, password is undefined`);
  }
  if (encryptedCookies === undefined) {
    throw new Error(`cookie read fail, encryptedCookies is undefined`);
  }
  const result: { [key: string]: string } = {}
  for (const key of Object.keys(encryptedCookies)) {
    if (encryptedCookies[key] === undefined) {
      continue
    }
    const value = chromeDecrypt(encryptedCookies[key] ?? '', password)
    result[key] = value
  }
  return result
}
