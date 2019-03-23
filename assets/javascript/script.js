/**
 * Brandon Mok
 * Javascript - Project 2
 */

$(document).ready(function(){
    // $('#RIT').click(function(){
    //     $('#landingImage').toggle("slow");
    // });

    // Tabs plugin
    $( "#tabs" ).tabs();


    // About information
    xhr('get', {path:"/about/"}, '#aboutContainer').done(function(results){
        var aboutSection = '<div id="aboutDiv">' +
                            '<p id="aboutTitle">' + results.title + '</p>' +
                            '<p id="aboutDesc">' + results.description + '</p>' +
                        '</div>';

        var quoteDiv = '<div id="quoteDiv">'+
                        '<p id="quote"><span class="quotes">"</span>' + results.quote  + '<span class="quotes">"</span></p>' +
                        '<p id="quoteAuthor"> - ' + results.quoteAuthor + '</p>' +
                    '</div>';

        // append to DOM
        $("#about").append(aboutSection);
        $("#about").append(quoteDiv);
    });



    // Degrees 
    // Get entire object so don't have to make an extra call
    xhr('get', {path:"/degrees/"}, '#degrees').done(function(results){

        // undergraduate
        $.each(results.undergraduate, function(){

            // var undergradCon = this.concentrations;
            // console.log(undergradCon);
    
            // for(var s in undergradCon){
            //     console.log(s);
            // }

            // need to parse the array for concentrations
            // var concentrations = this.concentrations;

            // stuff after - back
            $('#tabs-1').append('<div id="'+ this.degreeName +'" class="modal">' +
                                    '<h2>' + this.title + '</h2>' +
                                    '<p style="font-size: 1.2rem;">Concentrations:</p>' +
                                    '<ul>'+
                                    '<li>'+ this.concentrations +'</li>' +
                                    '</ul>'+
                                '</div>');


            // The modal itself - front
            $('#tabs-1').append('<a href="#'+this.degreeName+'" rel="modal:open">' +
                                    '<div class="uDegBoxes">'+
                                        '<p class="degreeName">' + this.title + '</p>' +
                                        '<p class="degreeDesc">' + this.description + '</p>' +
                                        '<i class="far fa-plus-square"></i>' +
                                    '</div>' +
                                '</a>');
       });



       // Graduate
       $.each(results.graduate, function(){
            // Only make ones that have a title
            if(this.title){
                $('#tabs-2').append('<div id="'+ this.degreeName +'" class="modal">' +
                                    '<h2>' + this.title + '</h2>' +
                                    '<p style="font-size: 1.2rem;">Concentrations:</p>' +
                                    '<ul>'+
                                    '<li>'+ this.concentrations +'</li>' +
                                    '</ul>'+
                                '</div>');

                $('#tabs-2').append('<a href="#'+this.degreeName+'" rel="modal:open">' +
                                    '<div class="uDegBoxes">'+
                                        '<p class="degreeName">' + this.title + '</p>' +
                                        '<p class="degreeDesc">' + this.description + '</p>' +
                                        '<i class="far fa-plus-square"></i>' +
                                    '</div>' +
                                '</a>');
            }
        });
    });



    // Minors Section
    xhr('get', {path:"/minors/"}, '#minors').done(function(results){

        // Iterate through each minor
        $.each(results.UgMinors , function(){
            $('#minors').append('<div class="eachMinor">'+ this.title +'</div>');
        });

    });


});





// AJAX utility
// args:
// 		getPost 			(is this for a get or a post)
// 		d - data			(path:'/about/')
// 		[idForSpinner]	(#parent (if I want a spinner to show up while it is loading))
// return: 
//		ajax object
// 	use:
//		xhr('get', {path:'/degrees/'}, #parent).done(function(json){})
function xhr(getPost,d,idForSpinner){
    // Since each data will be different, pass in the entire call obj
    return $.ajax({
                type: getPost,
                cache: false,
                async: true,
                dataType: 'json',
                data: d,
                url: 'proxy.php',

                beforeSend:function(){
                    // create the spinner IF there is a 3rd arg (optional)
                    $(idForSpinner).append('<img src="assets/images/loading.gif" class="dontuse" />');
                }
            }).always(function(){
                // kill the spinner
                $(idForSpinner).find('.dontuse').fadeOut(500, function(){
                    // kill it
                    $(this).remove();
                })
            }).fail(function(err){
                    console.log(err);
            });
}
