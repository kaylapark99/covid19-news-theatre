//EVENTUALLY fix problems in issues panel
//"indicate whether to send a cookie in cross site request by specifying its SameSite attribute"

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
    if(todayDeaths !== 0) {
        var perPerson = ((24*60*60)/todayDeaths).toFixed(2);
        var deadCount = $('#count-dead');
        $('#death-time').append(perPerson);
    
        //uncomment to start death count over;
        //localStorage.clear()
        if(localStorage.getItem('dead') === null) {
            localStorage.setItem('dead',0)
        }
        else {
            $('#count-dead').text(localStorage.dead);
        }
        setTimeout(function countDead(){
            localStorage.dead = Number(localStorage.getItem('dead')) + 1;
            deadCount.css({"color":"red","font-size":"40px"});
            deadCount.text(localStorage.getItem('dead'));
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
                    console.log(data['news'][articleNum]['title']);
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