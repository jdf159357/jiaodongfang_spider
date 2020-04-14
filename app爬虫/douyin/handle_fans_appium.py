from appium import webdriver
import time
from selenium.webdriver.support.ui import WebDriverWait


cap = {
  "platformName": "Android",
  "platformVersion ": "4.4.2",
  "deviceName": "127.0.0.1:62001",
  "appPackage": "com.ss.android.ugc.aweme",
  "appActivity": ".splash.TransitActivity",
  "noReset": True,
  "unicodekeyboard": True,
  "resetkeyboard": True
}

driver = webdriver.Remote("http://localhost:4723/wd/hub", cap)

#  点击搜索框
try:
    if WebDriverWait(driver, 3).until(lambda x:x.find_element_by_id('com.ss.android.ugc.aweme:id/b89')):
        driver.find_element_by_id('com.ss.android.ugc.aweme:id/b89').click()
except:
    pass

# 输入抖音id
try:
    if WebDriverWait(driver, 3).until(lambda x:x.find_element_by_id('com.ss.android.ugc.aweme:id/agi')):
        driver.find_element_by_id('com.ss.android.ugc.aweme:id/agi').send_keys('董雯')
except:
    pass

#  点击搜素的结果(第一个)
try:
    if WebDriverWait(driver, 3).until(lambda x:x.find_element_by_id('com.ss.android.ugc.aweme:id/e9p')):
        driver.find_element_by_id('com.ss.android.ugc.aweme:id/e9p').click()
except:
    pass

#  点击搜素的结果
try:
    if WebDriverWait(driver, 3).until(lambda x:x.find_element_by_id('com.ss.android.ugc.aweme:id/ea_')):
        driver.find_element_by_id('com.ss.android.ugc.aweme:id/ea_').click()
except:
    pass

#  点击粉丝
try:
    if WebDriverWait(driver, 10).until(lambda x:x.find_element_by_id('com.ss.android.ugc.aweme:id/ao5')):
        driver.find_element_by_id('com.ss.android.ugc.aweme:id/ao5').click()
except:
    pass

# 向下滑动
def get_size():
    x = driver.get_window_size('width')
    y = driver.get_window_size('height')
    return (x, y)

l = get_size()
x1 = int(l[0] * 0.5)
y1 = int(l[1] * 0.75)
y2 = int(l[1] * 0.25)

while True:
    driver.swipe(x1, y1, x1, y2)
    time.sleep(2)




