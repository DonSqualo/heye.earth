# heye.earth

This is the main code behind my website. It is custom coded for heye.earth, but with a little effort you could recreate it. 
I estimate copying my entire website and adjusting it to your liking would take ony ~4h. I won't write up detailed comments on the code, so you have to now your JavaScript if you want to use my exact setup. But Cluster + super.so gets you nearly all the way.
Total cost is ~12 € per month + 40 € once, including the domain.

## Notion

All the content is written and hosted on Notion: https://heye.notion.site/Heye-Earth-2015554ad5ae4339b9488ff1a73817bd?
You can just duplicate this, but I would suggest starting from scratch.


## Super.so
I then use super.so to turn this Notion into a static website

## Cluster
Additionally I use the theme Cluster, https://cluster.joshmillgate.co.uk/
Follow all the instructions after purchasing super.so and the theme.

## Google Domains
If you want a custom domain, use Google Domains or any other service.

## Custom Code
Important are:
Global.js -> Wrap it in a <script> tag and put it in super.so > Code > Body
Global.css -> Put it in Code > CSS
Home.js -> Go to Pages and then edit the code for the Home page > Body (wrap in script)
Home.css -> Again, goes under Page > Home > CSS

## Adding your home page sites
In Home.js you will find a const called LandingPageItems. You will have to make changes to it, giving it all your page URLs, images, texts and optionally arrows that you want to display.
(There is a function later on that overwrites a few things with videos, change that too)

## Cloudinary
I use cloudinary as my CDN (for hosting images). It's very handy and powerful, one of the reasons my site loads so fast.
