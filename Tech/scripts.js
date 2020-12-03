$.ajax({
    url: "https://api.covid19api.com/summary",
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('x-access-token', '5cf9dfd5-3449-485e-b5ae-70a60e997864');},
    success: function(data) {
        for(x=0;x<data['Countries'].length;x++){
            $("#countries-list").append("<li>"+data['Countries'][x]['Country']+"</li>");
        }
    },
    error: function(error){
        console.log(JSON.stringify(error));
    }
 });