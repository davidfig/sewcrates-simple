---
key: 1351
title: "Over-thought Solutions"
slug: Overthought_Solutions
type: musing
date: "2007-12-16 00:00:00"
created: "2007-12-16 00:00:00"
modified: null
location: Seattle, WA
hidden: false
no_front: false
locked: false
width: null
height: null
tags: [Programming, sewcrates.com]
---

<p class="normal">After posting my <a href=" /Archive/2007-12-06-00:00:00/" title="Painfully Regular Expressions">Painfully Regular Expressions</a>, <a href="http://liminality.org" title="Chuck">Chuck</a> commented that on his site, he threw the entire URL to the handler and let PHP parse it.</p><p class="normal">His RewriteCond probably looked something like this:</p><code>RewriteRule ^(.*)/?$ /handler.php?url=$1</code><p class="normal">And his PHP code probably looked like this:</p><code>$url=explode('/',$_GET['url']);</code><p class="normal">Alternatively (and where I ended up where I ran into problems with the way rewrite handled ampersands (&) in the tagnames, e.g., http://sewcrates.com/tags/D&D):</p><code>RewriteRule ^(.*)/?$ /handler.php</code><p class="normal">And the PHP code:</p><code>$url=explode('/',$_SERVER['REQUEST_URI']);</code><p class="normal">Both of these, by the way, beats the crap out of my PHP code for my original RewriteCond formulation:</p><code>$url=array($_GET['a'], $_GET['b'], $_GET['c'], $_GET['d'], $_GET['e']);</code><p class="normal">And has the added benefit of handling any number of parameters.</p><p class="normal">Sigh. This is one of those situations where my own cleverness got the best of me. I’ve since reconverted my .htaccess file to Chuck’s more elegant solution. I leave it to PHP to parse the URL. And with this egg on my face, I’ll return to my little programming hole.</p><p class="normal">One good thing did come of my earlier exercise. I learned the basics of regular expressions. After reading Chuck's mail, I created the new RewriteCond in only a few seconds. Before I went through my Painfully Regular Expressions, it would have taken much longer. I could have probably found Chuck's solution by Googling a bit--but I wouldn't have learned much. And look how many words I pushed to explain my failure!</p>
