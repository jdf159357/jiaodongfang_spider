# -*- encoding=utf8 -*-
from airtest.core.api import *
from poco.drivers.android.uiautomation import AndroidUiautomationPoco
from airtest.core.api import connect_device


auto_setup(__file__)

device_1 = connect_device('android:///6b0a1e2')
device_2 = connect_device('android:///emulator-5554')
poco_1 = AndroidUiautomationPoco(device_1, use_airtest_input=True, screenshot_each_action=False)
poco_2 = AndroidUiautomationPoco(device_2, use_airtest_input=True, screenshot_each_action=False)

# poco_1(name="com.ss.android.ugc.aweme:id/bjc").wait_for_appearance()
# poco_1(name="com.ss.android.ugc.aweme:id/bjc").wait(10).exists()

poco_1(text="知乎").click()
sleep(15)

poco_1(name="com.zhihu.android:id/input").click()
sleep(1)
poco_1(name="com.zhihu.android:id/input").set_text("python")

res_list = poco_1("com.zhihu.android:id/parent_fragment_content_id").offspring(
    "android.support.v7.widget.RecyclerView").child("android.widget.LinearLayout")
sleep(5)

for res in res_list:
    title = res.child(name="com.zhihu.android:id/magi_title").get_text()
    count = res.child(name="com.zhihu.android:id/magi_count").get_text()
    print(title, count)

poco_1(name="com.zhihu.android:id/magi_title")[0].click()
sleep(2)
while True:
    poco_1.swipe([0.5, 0.9], [0.5, 0.1], duration=0.1)
    title_objs = poco_1(name="com.zhihu.android:id/body_title")
    for title_obj in title_objs:
        print(title_obj.get_text())