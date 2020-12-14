# covid19-news-theatre

This is the artistic commentary take on my Covid-19 News Page: https://kaylapark99.github.io/covid-news/index.html 

NOTE: the articles and videos selected and display in thie project are not meant to represent my personal views. I created this news source to shed light on the varying opinions on one serious topic.

I fetched daily COVID Updates through https://api.covid19api.com/summary. The user can view both global and country based updates. The user selects the country using a dropdown menu, and an embedded graph will display a linear graph representing the death count for that specific country.

As of now, there are three COVID related topics I decided to focus on. I plan on adding more in the future. These topics include vaccines, reportings, and regulations. I utilized this API https://currentsapi.services/en to fetch the latest articles for each of these topics. In addition, I made Twitter Lists and embedded the tweets in order to display updated tweets from selected users.

I added a total death count that is stored in local storage. This tracks how many people on average have died from COVID-19 throughout the duration of your time viewing my site. When this count reaches certain numbers, such as 3, 27, 60... a large popup appears comparing the amount of people who have died from COVID while you sat staring at my site to the amount of people who have died from horrific global events such as the Boston Marathon bombing, the Sandy Hook Shooting, and the Las Vegas Massacre. This is in no way saying that the pandemic is as traumatizing as an elementary school mass shooting, but it is putting the number of deaths into perspective. I personally know many people who can not care less about the safety regulations for COVID-19 and complain about the closings of indoor dining. Meanwhile, thousands of people die per day from this deadly virus. Keep that in mind.

To add a little more *spice*, after viewing a page for 60 seconds, many of the elements on the page will turn red and switch to different elements. For example, article titles and headers will flip to a more aggressive view on the virus. The Twitter Lists will switch to a Twitter Collection of some of Donald Trump's problematic tweets in relation to COVID-19. I hope to develop this idea further, so instead of this being on a timer, this event will be triggered by certain interactions with the site. 

I am currently in the process of making the site responsive across all devices using Bootstrap.
