$(document).ready(function(){
    var countryCodes = {}

    // json file from https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
    $.getJSON("Tech/slim-3.json",function(data){
        for(c in data) {
            countryCodes[data[c]['name']] = data[c]['alpha-3'];
        }
    });

    var newsApiKey = 't8rFTHnPj3cUNdeQhfS0Br8ZEY1UuwCG2E98J5wrg05uXqUj';

    function latestArticles(search){
        alert('hi');
        $.ajax({
            url: "https://api.currentsapi.services/v1/search?",
            data: {
                'apiKey': newsApiKey,
                'keywords': search,
                'language': 'en'
            },
            type: "GET",
            success: function(data) {
                console.log(data);
            }
        });
    }

    $.ajax({
        url: "https://api.covid19api.com/summary",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token', '5cf9dfd5-3449-485e-b5ae-70a60e997864');
        },
    }).done(function(data){

            function formatDate(){
                var dateArray = data['Date'].substring(0,10).split('-');
                var date = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];
                var time = data['Date'].substring(11,19);
                return date + ' ' + time;
            }
            
            //updates global stats, toggle between today's stats vs overall
            $("#last-update").html(formatDate());
            $("#total-cases").html(data['Global']['TotalConfirmed'].toLocaleString());
            $("#total-deaths").html(data['Global']['TotalDeaths'].toLocaleString());
            $("#total-recovered").html(data['Global']['TotalRecovered'].toLocaleString());
            $("#today-cases").html(data['Global']['NewConfirmed'].toLocaleString());
            $("#today-deaths").html(data['Global']['NewDeaths'].toLocaleString());
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

        });

});
