//THIS IS WHEN THINGS GET FUN
function displayDeathNotice(y){
    $('.popup').css({"visibility":"visible"});
    $('.container-fluid').css({"filter":"blur(5px)"});
    $('#popup-caption').text(y);
}

function closepopup() {
    $('.popup').css({"visibility":"hidden"});
    $('.container-fluid').css({"filter":"none"});
}

//THE TECHNICAL STUFF FOR A 'NORMAL' LOOKING NEWSPAPER

//EVENTUALLY fix problems in issues panel
//"indicate whether to send a cookie in cross site request by specifying its SameSite attribute"
//eventially reformat code to make it cleaner and more readable
$(document).ready(function(){
    var countryCodes = {}
    var todayDeaths = 0;

    // json file from https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
    $.getJSON("Tech/slim-3.json",function(data){
        for(c in data) {
            countryCodes[data[c]['name']] = data[c]['alpha-3'];
        }
    });
    
    $.ajax({
        url: "https://api.covid19api.com/summary",
        type: "GET",
        async: false,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token', '5cf9dfd5-3449-485e-b5ae-70a60e997864');
        },
        success: function(data) {
            function formatDate(){
                var dateArray = data['Date'].substring(0,10).split('-');
                var date = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];
                var time = data['Date'].substring(11,19);
                return date + ' ' + time;
            }
    
            todayDeaths = data['Global']['NewDeaths'];
            
            //updates global stats, toggle between today's stats vs overall
            $("#last-update").html(formatDate());
            $("#total-cases").html(data['Global']['TotalConfirmed'].toLocaleString());
            $("#total-deaths").html(data['Global']['TotalDeaths'].toLocaleString());
            $("#total-recovered").html(data['Global']['TotalRecovered'].toLocaleString());
            $("#today-cases").html(data['Global']['NewConfirmed'].toLocaleString());
            $("#today-deaths").html(todayDeaths.toLocaleString());
            $("#today-recovered").html(data['Global']['NewRecovered'].toLocaleString());
        
            $.fn.toggleGlobal = function(x,y,z) {
                $(z).addClass('pressed');
                $(this).removeClass('pressed');
                $(x).removeClass('hide');
                $(y).addClass('hide');
            };
    
            //search for country
            var slugCountries = []
            var countries = []
            for(c in data['Countries']){
                slugCountries.push(data['Countries'][c]['Country'].toLowerCase());
                countries.push(data['Countries'][c]['Country']);
            }
    
            //find the index of the country within country arrays
            function findIndex(searched) {
                var indexCountry = countries.indexOf(searched);
                if(indexCountry == -1){
                    indexCountry = slugCountries.indexOf(searched);
                }
                return indexCountry;
            }
    
            function findCountries(search) {
                return countries.filter(c => {
                    const regex = RegExp(search, 'i');
                    return c.match(regex);
                });
            };
    
            //display dropdown menu
            function displayCountries() {
                var searchCountries = findCountries(this.value);
                var html = searchCountries.map(c => {
                    if(this.value == '' || findIndex(this.value) != -1) {
                        return ``
                    }
                    return `
                        <li>
                            <span class="search-country">${c}</span>
                        </li>  
                    `;
                }).join('');
                
                $('#countries-list').html(html); 
            }
    
            //events to trigger dropdown search
            var inputCountry = $('.search');
            inputCountry.on('keyup',displayCountries);
            inputCountry.on('paste',displayCountries);
    
            function updateGraph(cIndex){
                var htmlFirst = '<iframe src="https://ourworldindata.org/grapher/total-deaths-covid-19?country='
                var htmlLast = '" style="width: 100%; height: 600px; border: 3px solid;"></iframe>'
                var htmlAlpha = countryCodes[countries[cIndex]]
                $('.graph').html(htmlFirst+htmlAlpha+htmlLast);
            }
    
            //update results based off of selected country 
            function updateCountryData(cIndex) {
                var countryData = data['Countries'][cIndex];
                $("#total-country-cases").html(countryData['TotalConfirmed'].toLocaleString());
                $("#total-country-deaths").html(countryData['TotalDeaths'].toLocaleString());
                $("#total-country-recovered").html(countryData['TotalRecovered'].toLocaleString());
                $("#today-country-cases").html(countryData['NewConfirmed'].toLocaleString());
                $("#today-country-deaths").html(countryData['NewDeaths'].toLocaleString());
                $("#today-country-recovered").html(countryData['NewRecovered'].toLocaleString());
                $('#countries-list').html(''); 
                $('.search').val(data['Countries'][cIndex]['Country']);
                updateGraph(cIndex);
            }
    
            //check to see if input is a country
            function checkInput(input) {
                var indexCountry = findIndex(input)
                if(indexCountry != -1){
                    updateCountryData(indexCountry);
                }
                else{
                    alert(input + ' is not in the database!');
                }
            }
    
            inputCountry.on('keypress',function(e){
                if(e.which == 13) {
                    var searchFor = inputCountry.val();
                    checkInput(searchFor);
                }
            });
    
            //enable clicking on dropdown to select country
            $('#countries-list').on('click','li',(function(){
                var countryName = $(this).closest('li').find('span').text();
                checkInput(countryName);
    
            }));
        },
        error: function(){
            alert("Covid API Network Error!")
        }
    });


    //death count per day, how many people die on average 
    //eventually put inside ajax call? idk if that will work
    //but if not there is a synchronous warning
    var popupDict = {
        3: "The Boston Marathon bombing caused 3 tragic deaths and a nation wide panic. You literally just entered this site, and already 3 people on average have died from this virus...",
        27: "27 people were murdered during the terrifying Sandy Hook Elementary School shooting in 2012. I remember hearing about these deaths and was absolutely traumatized. The 27 deaths that just occured due to the deadly Coronavirus should scare you. This is not a joke.",
        60: "Remember the horrific Las Vegas shooting in 2017? It was a traumatic and brutal event that took 60 lives. In the time that you have been on my site, the same amount of people have died from Coronavirus. Yet, I still see people in public without masks.",
        130: "The November 2015 Paris attacks took 130 lives, traumatizing people around the globe. In that short amount of time you have been on this site, 130 lives were taken, and people seriously have the nerve to complain about not having indoor dining.",
        294: "294 U.S. soldiers have sacrificed their lives during the entirety of the Gulf War from August 1990 - February 1991. They were fighting for their country and died with dignity. What about the 294 people who just died from COVID? What did they die for?",
        909: "The Jonestown massacre represents the largest number of American civilian casualities in a single non-natural event. 909 people including 300 children committed mass suicide. So many lives lost in such a short span of time...",
        1836: "Hurricane Katrina, a Category 5 Atlantic Hurricane, caused $125 billion in damage. But more importantly, 1836 people did not make it to see another day, and neither will the 1836 people who have just passed due to COVID.",
        2403: "With a first wave of 180 aircrafts, Japan brutally attacked Pearl Harbor causing the deaths of 2403 people. This attack was deadly enough to compell the United States to enter WWII. That many people literally have died while you've been sitting here... what is the U.S. doing about that?",
        2996: "Never Forget. 9/11, one of the deadliest days in U.S. history... 2996 lives, just gone like that. It should absolutely terrify you that COVID took 2996 lives while you have been looking at my site."
    };
    var popupKeys = Object.keys(popupDict);


    if(todayDeaths !== 0) {
        var perPerson = ((24*60*60)/todayDeaths).toFixed(2);
        var deadCount = $('#count-dead');
        $('#death-time').append(perPerson);
    
        //uncomment to start death count over;
        //localStorage.clear()
        if(localStorage.getItem('dead') === null) {
            localStorage.setItem('dead',0)
            localStorage.setItem('popDictIndex', 0);
        }
        else {
            $('#count-dead').text(localStorage.dead);
        }


        setTimeout(function countDead(){
            localStorage.dead = Number(localStorage.getItem('dead')) + 1;
            var storedDeadCount = localStorage.dead;
            deadCount.css({"color":"red","font-size":"40px"});
            deadCount.text(storedDeadCount);

            if(storedDeadCount == popupKeys[localStorage.getItem('popDictIndex')]) {
                var popIndex = localStorage.getItem('popDictIndex');
                displayDeathNotice(popupDict[popupKeys[popIndex]]);
                localStorage.popDictIndex = Number(localStorage.getItem('popDictIndex')) + 1;
            }
            
            setTimeout(function(){
                deadCount.css({"color":"white","font-size":"20px"});
            },500);
            setTimeout(countDead, perPerson*1000);
        },perPerson*1000);
    }
    
    else {
        $('#death-time').text("x").css({"color":"red"});
        $('#count-dead').text("Data Unavailable.").css({"color":"red"});
    }


    //get latest news API
    var newsApiKey = 't8rFTHnPj3cUNdeQhfS0Br8ZEY1UuwCG2E98J5wrg05uXqUj';
    var className = $(document.body).attr('class');
    if(className !== 'updates'){
        var search = 'covid-19 ' + className;
        var url = 'https://api.currentsapi.services/v1/search?' +
        'keywords=' + search + '&language=en&' +
        'apiKey=' + newsApiKey;
        $.ajax({
            url: url,
            type: "GET",
            success: function(data) {
                var authors = $('.article-author');
                var images = $('.article-image');
                var descriptions = $('.article-description');
                var dates = $('.article-date');
                var links = $('.article-link')

                var articleNum = 0;
                var articleCount = 0;
                var articleTitles = [];
                
                while(articleCount != 8) {
                    var title = data['news'][articleNum]['title'];
                    if(!articleTitles.includes(title)){
                        articleTitles.push(title);
                        var articleURL = data['news'][articleNum]['url'];
                        var link = '<a href="' + articleURL + '" target="_blank">'+ title + '</a>';
                        var author = data['news'][articleNum]['author'];
                        var image = data['news'][articleNum]['image'];
                        var description = data['news'][articleNum]['description'];
                        var date = data['news'][articleNum]['published'].substring(0,19);

                        if(image!=='None') {
                            var imgSrc = '<img src="'+image + '"/>';
                            $(images[articleCount]).html(imgSrc);
                        }
                        $(links[articleCount]).html(link);
                        author = author.replace('-',' ');
                        $(authors[articleCount]).html('By: ' + author);
                        $(descriptions[articleCount]).html(description.toLocaleString());
                        $(dates[articleCount]).html('Published: ' + date.toLocaleString());
                        articleCount++;
                    }
                    articleNum++;
                }

            },
            error: function() {
                for(l=0; l<=5; l++) {
                    $('.article-description')[l].text('Error. Articles not available.');
                }
            }
        });
        
    }
    
});

setTimeout(function(){
    $('.switch-bad').removeClass('toggle-on');
    $('.switch-good').addClass('toggle-on');

    $('.switch-bad-end').mouseenter(function () { 
        $('.switch-bad-end').text('MAKE IT STOP');
    });
    $('.switch-bad-end').mouseleave(function () { 
        $('.switch-bad-end').text('THIS IS NOT A JOKE');
    });
    $('.switch-bad-end').click(function () { 
        $('.switch-good').removeClass('toggle-on');
        $('.switch-bad').addClass('toggle-on');
        $('#covid-chart').attr("src", $('#covid-chart').attr("src"));
    });
}, 45000);