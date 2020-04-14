from appium import webdriver
import time
from selenium.webdriver.support.ui import WebDriverWait
import logging
import traceback

cap = {
  "platformName": "Android",
  "platformVersion": "4.4.2",
  "deviceName": "127.0.0.1:62001",
  "appPackage": "com.ss.android.article.lite",
  "appActivity": ".activity.MainActivity",
  "noReset": True
}

driver = webdriver.Remote("http://localhost:4723/wd/hub", cap)


def get_size():
    x = driver.get_window_size()['width']
    y = driver.get_window_size()['height']
    return (x, y)


l = get_size()
x1 = int(l[0] * 0.5)
y1 = int(l[1] * 0.75)
y2 = int(l[1] * 0.25)


def swipe():
    driver.swipe(x1, y1, x1, y2)


if __name__ == '__main__':
    # 判断搜索框是否出现
    try:
        if WebDriverWait(driver, 3).until(lambda x: x.find_element_by_id('com.ss.android.article.lite:id/qm')):
            el1 = driver.find_element_by_id("com.ss.android.article.lite:id/qm")
            el1.click()
            el2 = driver.find_element_by_id("com.ss.android.article.lite:id/gr")
            el2.send_keys("皮鞋")
            el3 = driver.find_element_by_id("com.ss.android.article.lite:id/i8")
            el3.click()
    except Exception as e:
        print(e)
        logging.info(traceback.format_exc(chain=e))

    while True:
        swipe()
        time.sleep(1)