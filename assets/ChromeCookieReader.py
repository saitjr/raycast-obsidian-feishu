from pycookiecheat import chrome_cookies
import sys
import json

host = sys.argv[1]

cookies = chrome_cookies(host)
print(json.dumps(cookies, ensure_ascii=False))
