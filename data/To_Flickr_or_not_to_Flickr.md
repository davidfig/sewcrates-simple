---
key: 1346
title: To Flickr or not to Flickr
slug: To_Flickr_or_not_to_Flickr
type: musing
date: "2007-11-30 18:00:00"
created: "2007-11-30 18:00:00"
modified: null
location: Seattle, WA
hidden: false
no_front: false
locked: false
width: null
height: null
tags: [Programming, sewcrates.com]
---

<p class="normal">I finally got my Flickr account working with sewcrates.com. I created a couple of sample photosets, and went about displaying them on a test page. It worked, but I’m disappointed. The Flickr terms of use limit the photos displayed on a page to 30, and a link back to the Flickr page from each photograph. There is also a rather significant delay as the API calls work through the Yahoo! systems. The photo download speeds once you have the list were quite good. It would be trivial to cache the results on a static page to avoid the delay. This doesn’t get around the terms of use limitations, however.</p><p class="normal">While coding, I ran into one snag: the <a href="http://flickr.com/services/api/" title="Flickr API documentation">Flickr API documentation</a> uses PHP’s <a href="http://us2.php.net/manual/en/function.file-get-contents.php" title="file_get_contents()">file_get_contents()</a> to read the Flickr serialized output. Dreamhost does not permit the file_get_contents() call for URLs (the flag is <span class="italics">allow_url_fopen</span> in the PHP.ini file). Dreamhost’s wiki provides a <a href="http://wiki.dreamhost.com/CURL" title="very easy workaround using cURL">very easy workaround using cURL</a>.</p><p class="normal">The PHP serialized Flickr call function is as follows:</p><div class="code"><?php
// On success: returns array with Flickr data related to $params; Echo calls+error and returns FALSE on failure
function flickr($params,$use_userid=false) {
        if ($use_userid)
                $params['user_id']='*'; // your user_id goes here (for convenience) 
        $params['api_key']='*'; // your Flickr api key from http://flickr.com/services/api/keys/ goes here
        $params['format']='php_serial';

        $encoded_params = array();
        foreach ($params as $k => $v)
                $encoded_params[] = urlencode($k).'='.urlencode($v);

        $url="http://api.flickr.com/services/rest/?".implode('&', $encoded_params);
        $ch = curl_init($url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,5);
        $rsp=curl_exec($ch);
        curl_close($ch);
        $rsp_obj=unserialize($rsp);

        if ($rsp_obj['stat']!='ok') {
                echo 'Flickr call failed:<br>';
                print_r($params);
                echo '<br>';
                print_r($rsp_obj);
                return false;
        }
        else
                return $rsp_obj;

}
?></div><p class="normal">I created the following code to test the Flickr calls:</p><div class="code"><?php
function flickr_sets() {
$params=array('method'=>'flickr.photosets.getList');
        $sets=flickr($params,true);
$count=0;
        $sets=$sets['photosets']['photoset'];
foreach($sets as $set) {
                $id=$set['id'];
$title=implode(' ',$set['title']);
$description=implode(' ',$set['description']);
$count=$set['photos'];

                $params=array('method'=>'flickr.photosets.getPhotos','extras'=>'date_taken','photoset_id'=>$id);
                $photos=flickr($params,false);
                $photos=$photos['photoset']['photo'];
                foreach ($photos as $photo) {
                        $params=array('method'=>'flickr.photos.getSizes','photo_id'=>$photo['id']);
                        $sizes=flickr($params,false);
                        echo '<img src="'.$sizes['sizes']['size'][0]['source'].'" alt="">';
                }
        }

}
?></div><p class="normal">While it was a fun exercise, I decided not to use Flickr to host my photos. There are too many limitations on how I can use the APIs. That means more coding for me, as I figure out a good way to store the photographs in my database. It’s also provides more flexibility in tagging and displaying the content. This means back to the drawing board on my database design.</p>
