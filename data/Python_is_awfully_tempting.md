---
key: 1348
title: Python is awfully tempting
slug: Python_is_awfully_tempting
type: musing
date: "2007-12-05 00:00:00"
created: "2007-12-05 00:00:00"
modified: null
location: Seattle, WA
hidden: false
no_front: false
locked: false
width: null
height: null
tags: [Programming, sewcrates.com]
---

<p class="normal">The coding process for the secret NAIS project is in full swing. I managed to port over all of my text-based postings to my new database. I am creating NAIS in three parts: retrieval (URL parsing and database fetch), display, and editing. I’m not yet decided on how or where editing will live. In the current sewcrates, all three mostly live in the same place (albeit separate source files). I’m trying to better abstract this relationship.</p><p class="normal">After reading today’s <a href="http://xkcd.com/353/" title="Xkcd comic">Xkcd comic</a>, I spent about an hour reading through the Python documentation and growing very excited by the syntax of the language. It seemed to do things correctly compared to PHP, which is a badly designed language. Easy example: every time I call a string command, I have to look up the ordering of the parameters:</p><code><p class="normal">mixed str_replace ( mixed $search , mixed $replace , mixed **$subject** [, int &$count ] )</p><p class="normal">int stripos ( string **$haystack** , string $needle [, int $offset ] )</p></code><p class="normal">Note that the haystack variable (renamed $subject in the case of str_replace) is in different places for these two related functions. It is infuriating.</p><p class="normal">Even with all the problems I have with PHP, I decided to stay with it for NAIS. There seems to be some issues with the <a href="http://wiki.dreamhost.com/index.php/Python" title="speed of Python-related webpages in Dreamhost">speed of Python-related webpages in Dreamhost</a>. Additionally, it’s not a good idea to start a large project to learn a new language. It makes more sense to write smaller pieces of code. I don’t want to finish NAIS, only to have acquired enough elegance with Python to want to rewrite it.</p>
