---
key: 1506
title: Weather Doodles
slug: Weather_Doodles
type: musing
date: "2008-01-02 10:29:09"
created: "2008-01-02 10:10:42"
modified: null
location: Seattle, WA
hidden: false
no_front: false
locked: false
width: null
height: null
tags: [Programming, sewcrates.com]
---

<p class="normal">The masthead on NAIS changes based on the local weather, temperature, and sunset and sunrise time. I added the daylight check at Doolies’s request. She didn’t understand why my weather doodle showed sunny at 5pm. This time of year, the sun sets at 4:29pm, and rises at 7:58am. I wish I was making this up.</p><p class="normal">First, I read in the XML file from the very helpful <a href="http://www.weather.gov/" title="National Oceanic and Atmospheric Administration’s National Weather Service">National Oceanic and Atmospheric Administration’s National Weather Service</a>. They provide a number of <a href="http://www.weather.gov/rss/" title="great RSS feeds">great RSS feeds</a>, of which I chose the <a href="http://www.weather.gov/data/current_obs/" title="hourly observations">hourly observations</a>. I picked KRNT.xml, the feed for the Renton Municipal weather station, because it felt closest (knowing my geographic sense, I could be way off). Here’s the PHP code (remember, I can’t use <a href="http://us2.php.net/manual/en/function.file-get-contents.php" title="file_get_contents()">file_get_contents()</a> on a URL because of the PHP.ini security setting. I replaced it with the <a href="http://us2.php.net/manual/en/ref.curl.php" title="CURL call">CURL call</a>):</p><div class="code"><?php
        if (!file_exists($file) || !filemtime($file)>time()-30*60) {
                $ch = curl_init('http://www.nws.noaa.gov/data/current_obs/KRNT.xml');
                $fp = fopen('weather.xml', 'w');
                curl_setopt($ch,CURLOPT_FILE,$fp);
                curl_setopt($ch,CURLOPT_HEADER,false);
                curl_setopt($ch,CURLOPT_FOLLOWLOCATION,true);
                curl_setopt ($ch,CURLOPT_CONNECTTIMEOUT,3);
                $result=curl_exec($ch);
                curl_close($ch);
                fclose($fp);

                if ($result) {
                        $xml_parser=xml_parser_create();
                        $data=file_get_contents('weather.xml');
                        xml_parse_into_struct($xml_parser,$data,$values,$index);

                        $weather=$values[$index['WEATHER'][0]]['value'];
                        $temp=$values[$index['TEMP_F'][0]]['value'];

                        file_put_contents('weather',$weather.','.$temp);
                        unlink('weather.xml');
                }
        }
        $weathertitle='Seattle WA: '.$weather.', '.$temp.'&deg; F';
        $s.='<a href="/" title="'.$weathertitle.'">';

?></div><p class="normal">The code checks the weather once every thirty minutes, and saves the parsed result to a flat file. I use this file as a cache so I don’t have to reparse the XML file each time. There is higher-level page cache (which I plan to write more about) that also uses flat files to take the load off the MySQL server, which seems to be the bottleneck in serving pages.</p><p class="normal">I plan to generalize the above code a bit in the future so when I travel, I can replace Seattle with my destination (and its corresponding weather station). While this would be a trivial change, it’s not very high on my list.</p><p class="normal">After I load the XML file, I use the <a href="http://us2.php.net/manual/en/function.xml-parse.php" title="PHP xml parser">PHP xml parser</a> to parse the document and find the weather description and temperature. I called <a href="http://us2.php.net/manual/en/function.xml-parse-into-struct.php" title="xml_parse_into_struct()">xml_parse_into_struct()</a> to perform the parsing. I still don’t quite understand how the structure is created. Through trial and error, I found the appropriate structure and array elements.</p><p class="normal">For the daylight check, I used the convenient PHP functions <a href="http://us2.php.net/manual/en/function.date-sunrise.php" title="date_sunrise()">date_sunrise()</a> and <a href="http://us2.php.net/manual/en/function.date-sunset.php" title="date_sunset()">date_sunset()</a>. These functions use the longitude and latitude and return sunset and sunrise times for the requested day.</p><div class="code"><?php
if (time()<date_sunrise(time(),SUNFUNCS_RET_TIMESTAMP,45,-122) || time()>date_sunset(time(),SUNFUNCS_RET_TIMESTAMP,45,-122))
$doodle='night-'.$doodle;
?></div><p class="normal">And then I have the weather parsing code. As I add more weather doodles, I continue to tweak the code. It turns out the weather service uses <a href="http://www.weather.gov/data/current_obs/weather.php" title="many phrases to describe weather conditions">many phrases to describe weather conditions</a>. Some examples: “Thunderstorm in Vicinity Hail Haze,” “Showers in Vicinity Fog/Mist,” and “Heavy Sand Storm.” At first, I created a huge <a href="http://us2.php.net/manual/en/control-structures.switch.php" title="switch/case statement">switch/case statement</a> to capture all of the phrases. After a bit of thought, I decided to fall back on simpler phrase searches through an <a href="http://us2.php.net/else" title="if/else">if/else</a> statement. I set it up as a hierarchy to ensure the most desirable doodle is selected, e.g., if it’s “Light Drizzle Fog/Mist” it chooses the fog doodle—mostly because it’s less common. Similarly, if there’s a mention of snow or frozen rain, it chooses the snow doodle.</p><p class="normal">I will add a more robust temperature/season check once I have more relevant doodles. I’m hemming and hawing because I’m not satisfied with the following code. But I’ll include it for completeness.</p><div class="code"><?php
// Here for terminology: http://www.nws.noaa.gov/data/current_obs/weather.php
if (stristr($weather,'thunderstorm'))
                $doodle='rain.png';
        else if (stristr($weather,'ice') || stristr($weather,'snow') || stristr($weather,'hail'))
$doodle='snow.png';
        else if (stristr($weather,'fog') || stristr($weather,'smoke'))
                $doodle='fog.png';
        else if (stristr($weather,'rain') || stristr($weather,'drizzle') || stristr($weather,'showers'))
$doodle='rain.png';
        else if (stristr($weather,'cloud') || stristr($weather,'overcast'))
               if (stristr($weather,'partly') || stristr($weather,'few'))
                        $doodle='sun-cloud.png';
                else
                        $doodle='cloudy.png';
        else if (stristr($weather,'breez') || stristr($weather,'wind'))
                $doodle='rain.png';
        else {
                if ($temp>50)
$doodle='sun.png';
else
$doodle='sun-cold.png';
}
?></div><p class="normal">My next step is to get doodling. It’s great to have all this code, but it’s wasted if my weather doodle is always the same. I plan to have a bunch of rain and cloudy doodles for the winter, and many sunny doodles for the summer. In Seattle, the word rain is much like the word snow is to Eskimos: you need many words (and doodles) to capture its essence.</p>
