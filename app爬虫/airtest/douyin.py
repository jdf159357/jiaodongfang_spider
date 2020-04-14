# -*- encoding=utf8 -*-
from airtest.core.api import *
from poco.drivers.android.uiautomation import AndroidUiautomationPoco
import multiprocessing

auto_setup(__file__)


def handle_douyin(poco):
    while True:
        # 判断搜索框元素是否出现
        if poco(name="com.ss.android.ugc.aweme:id/bjc").wait(30).exists():
            poco(name="com.ss.android.ugc.aweme:id/bjc").click()
        else:
            print('没有找到这个元素1')

        if poco(name="com.ss.android.ugc.aweme:id/ahv").wait(30).exists():
            poco(name="com.ss.android.ugc.aweme:id/ahv").set_text("18648859")
        else:
            print('没有找到这个元素2')

        if poco(text="18648859", type="android.widget.TextView").wait().exists():
            poco(text="18648859", type="android.widget.TextView").click()
        else:
            print('没有找到这个元素3')

        if poco(text="用户").wait().exists():
            poco(text="用户").click()
        else:
            print('没有找到这个元素4')

        if poco(name="android.widget.ImageView").wait().exists():
            poco(name="android.widget.ImageView").click()
        else:
            print('没有找到这个元素5')


def handle_airtest(device_value):
    device = connect_device(device_value)
    poco = AndroidUiautomationPoco(device, use_airtest_input=True, screenshot_each_action=False)
    poco(text="抖音短视频").click()
    handle_douyin(poco)


if __name__ == '__main__':
    m_list = []
    device_list = ['android:///emulator-5554', 'android:///emulator-5556']
    for device in device_list:
        m_list.append(multiprocessing.Process(target=handle_airtest, args=(device,)))

    for m1 in m_list:
        m1.start()

    for m2 in m_list:
        m2.join()