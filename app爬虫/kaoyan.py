# pip3 install Appium-Python-Client
from appium import webdriver
import time
from selenium.webdriver.support.ui import WebDriverWait

cap = {
  "platformName": "Android",
  "platformVersion": "4.4.2",
  "deviceName": "127.0.0.1:62001",
  "appPackage": "com.tal.kaoyan",
  "appActivity": ".ui.activity.ucenter.LoginActivity",
  "noReset": True
}

driver = webdriver.Remote("http://localhost:4723/wd/hub", cap)

try:
    if WebDriverWait(driver, 3).until(lambda x:x.find_element_by_id('com.tal.kaoyan:id/login_email_edittext')):
        driver.find_element_by_id('com.tal.kaoyan:id/login_email_edittext').send_keys('jdf000')
        driver.find_element_by_id('com.tal.kaoyan:id/login_password_edittext').send_keys('qwert!@#$%')
        driver.find_element_by_id('com.tal.kaoyan:id/login_login_btn').click()
        time.sleep(3)
except:
    pass


def get_size():
    x = driver.get_window_size('width')
    y = driver.get_window_size('height')
    return (x, y)

l = get_size()
x1 = int(l[0] * 0.5)
y1 = int(l[1] * 0.75)
y2 = int(l[1] * 0.25)
driver.swipe(x1, y1, x1, y2)