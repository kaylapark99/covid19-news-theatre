$(document).ready(function(){

    $.ajax({
        url: "https://api.covid19api.com/summary",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token', '5cf9dfd5-3449-485e-b5ae-70a60e997864');
        },
    }).done(function(data){
            //updates global stats, toggle between today's stats vs overall
            $("#last-update").html(data['Date']);
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

            function findCountries(search) {
                return countries.filter(c => {
                    const regex = RegExp(search, 'i');
                    return c.match(regex);
                });
            };

            function displayCountries() {
                var searchCountries = findCountries(this.value);
                html = searchCountries.map(c => {
                    if(this.value == '') {
                        return ``
                    }
                    return `
                        <li><a href="#">
                            <span class="search-country" onclick="alert('hi')">${c}</span>
                        </a></li>  
                    `;
                }).join('');
                
                $('#countries-list').html(html); 
            }

            var inputCountry = $('.search');
            inputCountry.on('keyup',displayCountries);
            inputCountry.on('paste',displayCountries);
2
            //update results based off of selected country 
            inputCountry.on('keypress',function(e){
                if(e.which == 13) {
                    var searchFor = inputCountry.val();
                    var indexCountry = countries.indexOf(searchFor);
                    if(indexCountry == -1){
                        indexCountry = slugCountries.indexOf(searchFor);
                        if(indexCountry == -1){
                            alert("Country name not in database!");
                        }
                    }
                    var countryData = data['Countries'][indexCountry];
                    $("#total-country-cases").html(countryData['TotalConfirmed'].toLocaleString());
                    $("#total-country-deaths").html(countryData['TotalDeaths'].toLocaleString());
                    $("#total-country-recovered").html(countryData['TotalRecovered'].toLocaleString());
                    $("#today-country-cases").html(countryData['NewConfirmed'].toLocaleString());
                    $("#today-country-deaths").html(countryData['NewDeaths'].toLocaleString());
                    $("#today-country-recovered").html(countryData['NewRecovered'].toLocaleString());
                }
            });

        });
});
