import time
from selenium import webdriver


option = webdriver.ChromeOptions()
# option.add_argument('--headless')
# option.add_argument('--disable-gpu')
option.add_argument("--user-agent=Mozilla/5.0 HAHA")
driver = webdriver.Chrome(executable_path="./chromedriver", options=option)

a = 'abc'
b = 'def'
js = """
function demo(a, b){
    return a + b;
}

res = demo('%s', '%s');
return res;
""" % (a, b)


res = driver.execute_script(js)
print(res)

time.sleep(3)
driver.close()