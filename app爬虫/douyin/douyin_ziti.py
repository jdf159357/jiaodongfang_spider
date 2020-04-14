from fontTools.ttLib import TTFont
font_1 = TTFont('douyin.ttf')
font_1.saveXML('font_1.xml')

map_str = """
<cmap>
    <tableVersion version="0"/>
    <cmap_format_4 platformID="0" platEncID="3" language="0">
      <map code="0x78" name="x"/><!-- LATIN SMALL LETTER X -->
      <map code="0xe602" name="num_"/><!-- ???? -->
      <map code="0xe603" name="num_1"/><!-- ???? -->
      <map code="0xe604" name="num_2"/><!-- ???? -->
      <map code="0xe605" name="num_3"/><!-- ???? -->
      <map code="0xe606" name="num_4"/><!-- ???? -->
      <map code="0xe607" name="num_5"/><!-- ???? -->
      <map code="0xe608" name="num_6"/><!-- ???? -->
      <map code="0xe609" name="num_7"/><!-- ???? -->
      <map code="0xe60a" name="num_8"/><!-- ???? -->
      <map code="0xe60b" name="num_9"/><!-- ???? -->
      <map code="0xe60c" name="num_4"/><!-- ???? -->
      <map code="0xe60d" name="num_1"/><!-- ???? -->
      <map code="0xe60e" name="num_"/><!-- ???? -->
      <map code="0xe60f" name="num_5"/><!-- ???? -->
      <map code="0xe610" name="num_3"/><!-- ???? -->
      <map code="0xe611" name="num_2"/><!-- ???? -->
      <map code="0xe612" name="num_6"/><!-- ???? -->
      <map code="0xe613" name="num_8"/><!-- ???? -->
      <map code="0xe614" name="num_9"/><!-- ???? -->
      <map code="0xe615" name="num_7"/><!-- ???? -->
      <map code="0xe616" name="num_1"/><!-- ???? -->
      <map code="0xe617" name="num_3"/><!-- ???? -->
      <map code="0xe618" name="num_"/><!-- ???? -->
      <map code="0xe619" name="num_4"/><!-- ???? -->
      <map code="0xe61a" name="num_2"/><!-- ???? -->
      <map code="0xe61b" name="num_5"/><!-- ???? -->
      <map code="0xe61c" name="num_8"/><!-- ???? -->
      <map code="0xe61d" name="num_9"/><!-- ???? -->
      <map code="0xe61e" name="num_7"/><!-- ???? -->
      <map code="0xe61f" name="num_6"/><!-- ???? -->
    </cmap_format_4>
    <cmap_format_12 platformID="0" platEncID="4" format="12" reserved="0" length="388" language="0" nGroups="31">
      <map code="0x78" name="x"/><!-- LATIN SMALL LETTER X -->
      <map code="0xe602" name="num_"/><!-- ???? -->
      <map code="0xe603" name="num_1"/><!-- ???? -->
      <map code="0xe604" name="num_2"/><!-- ???? -->
      <map code="0xe605" name="num_3"/><!-- ???? -->
      <map code="0xe606" name="num_4"/><!-- ???? -->
      <map code="0xe607" name="num_5"/><!-- ???? -->
      <map code="0xe608" name="num_6"/><!-- ???? -->
      <map code="0xe609" name="num_7"/><!-- ???? -->
      <map code="0xe60a" name="num_8"/><!-- ???? -->
      <map code="0xe60b" name="num_9"/><!-- ???? -->
      <map code="0xe60c" name="num_4"/><!-- ???? -->
      <map code="0xe60d" name="num_1"/><!-- ???? -->
      <map code="0xe60e" name="num_"/><!-- ???? -->
      <map code="0xe60f" name="num_5"/><!-- ???? -->
      <map code="0xe610" name="num_3"/><!-- ???? -->
      <map code="0xe611" name="num_2"/><!-- ???? -->
      <map code="0xe612" name="num_6"/><!-- ???? -->
      <map code="0xe613" name="num_8"/><!-- ???? -->
      <map code="0xe614" name="num_9"/><!-- ???? -->
      <map code="0xe615" name="num_7"/><!-- ???? -->
      <map code="0xe616" name="num_1"/><!-- ???? -->
      <map code="0xe617" name="num_3"/><!-- ???? -->
      <map code="0xe618" name="num_"/><!-- ???? -->
      <map code="0xe619" name="num_4"/><!-- ???? -->
      <map code="0xe61a" name="num_2"/><!-- ???? -->
      <map code="0xe61b" name="num_5"/><!-- ???? -->
      <map code="0xe61c" name="num_8"/><!-- ???? -->
      <map code="0xe61d" name="num_9"/><!-- ???? -->
      <map code="0xe61e" name="num_7"/><!-- ???? -->
      <map code="0xe61f" name="num_6"/><!-- ???? -->
    </cmap_format_12>
    <cmap_format_0 platformID="1" platEncID="0" language="0">
      <map code="0x78" name="x"/>
    </cmap_format_0>
    <cmap_format_4 platformID="3" platEncID="1" language="0">
      <map code="0x78" name="x"/><!-- LATIN SMALL LETTER X -->
      <map code="0xe602" name="num_"/><!-- ???? -->
      <map code="0xe603" name="num_1"/><!-- ???? -->
      <map code="0xe604" name="num_2"/><!-- ???? -->
      <map code="0xe605" name="num_3"/><!-- ???? -->
      <map code="0xe606" name="num_4"/><!-- ???? -->
      <map code="0xe607" name="num_5"/><!-- ???? -->
      <map code="0xe608" name="num_6"/><!-- ???? -->
      <map code="0xe609" name="num_7"/><!-- ???? -->
      <map code="0xe60a" name="num_8"/><!-- ???? -->
      <map code="0xe60b" name="num_9"/><!-- ???? -->
      <map code="0xe60c" name="num_4"/><!-- ???? -->
      <map code="0xe60d" name="num_1"/><!-- ???? -->
      <map code="0xe60e" name="num_"/><!-- ???? -->
      <map code="0xe60f" name="num_5"/><!-- ???? -->
      <map code="0xe610" name="num_3"/><!-- ???? -->
      <map code="0xe611" name="num_2"/><!-- ???? -->
      <map code="0xe612" name="num_6"/><!-- ???? -->
      <map code="0xe613" name="num_8"/><!-- ???? -->
      <map code="0xe614" name="num_9"/><!-- ???? -->
      <map code="0xe615" name="num_7"/><!-- ???? -->
      <map code="0xe616" name="num_1"/><!-- ???? -->
      <map code="0xe617" name="num_3"/><!-- ???? -->
      <map code="0xe618" name="num_"/><!-- ???? -->
      <map code="0xe619" name="num_4"/><!-- ???? -->
      <map code="0xe61a" name="num_2"/><!-- ???? -->
      <map code="0xe61b" name="num_5"/><!-- ???? -->
      <map code="0xe61c" name="num_8"/><!-- ???? -->
      <map code="0xe61d" name="num_9"/><!-- ???? -->
      <map code="0xe61e" name="num_7"/><!-- ???? -->
      <map code="0xe61f" name="num_6"/><!-- ???? -->
    </cmap_format_4>
    <cmap_format_12 platformID="3" platEncID="10" format="12" reserved="0" length="388" language="0" nGroups="31">
      <map code="0x78" name="x"/><!-- LATIN SMALL LETTER X -->
      <map code="0xe602" name="num_"/><!-- ???? -->
      <map code="0xe603" name="num_1"/><!-- ???? -->
      <map code="0xe604" name="num_2"/><!-- ???? -->
      <map code="0xe605" name="num_3"/><!-- ???? -->
      <map code="0xe606" name="num_4"/><!-- ???? -->
      <map code="0xe607" name="num_5"/><!-- ???? -->
      <map code="0xe608" name="num_6"/><!-- ???? -->
      <map code="0xe609" name="num_7"/><!-- ???? -->
      <map code="0xe60a" name="num_8"/><!-- ???? -->
      <map code="0xe60b" name="num_9"/><!-- ???? -->
      <map code="0xe60c" name="num_4"/><!-- ???? -->
      <map code="0xe60d" name="num_1"/><!-- ???? -->
      <map code="0xe60e" name="num_"/><!-- ???? -->
      <map code="0xe60f" name="num_5"/><!-- ???? -->
      <map code="0xe610" name="num_3"/><!-- ???? -->
      <map code="0xe611" name="num_2"/><!-- ???? -->
      <map code="0xe612" name="num_6"/><!-- ???? -->
      <map code="0xe613" name="num_8"/><!-- ???? -->
      <map code="0xe614" name="num_9"/><!-- ???? -->
      <map code="0xe615" name="num_7"/><!-- ???? -->
      <map code="0xe616" name="num_1"/><!-- ???? -->
      <map code="0xe617" name="num_3"/><!-- ???? -->
      <map code="0xe618" name="num_"/><!-- ???? -->
      <map code="0xe619" name="num_4"/><!-- ???? -->
      <map code="0xe61a" name="num_2"/><!-- ???? -->
      <map code="0xe61b" name="num_5"/><!-- ???? -->
      <map code="0xe61c" name="num_8"/><!-- ???? -->
      <map code="0xe61d" name="num_9"/><!-- ???? -->
      <map code="0xe61e" name="num_7"/><!-- ???? -->
      <map code="0xe61f" name="num_6"/><!-- ???? -->
    </cmap_format_12>
  </cmap>
"""