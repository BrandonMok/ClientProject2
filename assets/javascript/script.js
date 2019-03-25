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

    // $( "#accordion" ).accordion({
    //     collapsible: true
    // });



    /**
     * About
     */
    xhr('get', {path:"/about/"}, '#aboutContainer').done(function(results){
        var aboutSection = '<div id="aboutDiv" class="altSection">' +
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


    /**
     * Degrees
     * Get entire object so don't have to make an extra call
     */
    xhr('get', {path:"/degrees/"}, '#degrees').done(function(results){

        // undergraduate
        $.each(results.undergraduate, function(){

            var backModal = '<div id="'+ this.degreeName +'" class="modal">' +
                            '<h2>' + this.title + '</h2>' +
                            '<p class="conSubHeading">Concentrations:</p>' +
                            '<ul class="conList">';


            $.each(this.concentrations, function(index , elem){
                backModal += '<li>' + elem + '</li>'; 
            });
            backModal += '</ul></div>';


            var frontModal = '<a href="#'+this.degreeName+'" rel="modal:open">' +
                                    '<div class="uDegBoxes">'+
                                        '<p class="degreeName">' + this.title + '</p>' +
                                        '<p class="degreeDesc">' + this.description + '</p>' +
                                        '<i class="far fa-plus-square"></i>' +
                                    '</div>' +
                                '</a>';

            // Append to dom
            $('#tabs-1').append(backModal); // stuff after - back
            $('#tabs-1').append(frontModal);// The modal itself - front
       });


       // Graduate
       $.each(results.graduate, function(){
            // Only make ones that have a title
            if(this.title){
                var backModal = '<div id="'+ this.degreeName +'" class="modal">' +
                                    '<h2>' + this.title + '</h2>' +
                                    '<p class="conSubHeading">Concentrations:</p>' +
                                    '<ul class="conList">';
                
                

                $.each(this.concentrations, function(index , elem){
                    backModal += '<li>' + elem + '</li>'; 
                });
                backModal += '</ul></div>';



                var frontModal = '<a href="#'+this.degreeName+'" rel="modal:open">' +
                                    '<div class="uDegBoxes">'+
                                        '<p class="degreeName">' + this.title + '</p>' +
                                        '<p class="degreeDesc">' + this.description + '</p>' +
                                        '<i class="far fa-plus-square"></i>' +
                                    '</div>' +
                                '</a>';


                $('#tabs-2').append(backModal);
                $('#tabs-2').append(frontModal);
            }
       });
    });




    // Minors Section
    xhr('get', {path:"/minors/"}, '#minors').done(function(results){

        // Iterate through each minor
        $.each(results.UgMinors , function(){

            var backModal = '<div id="'+ this.name +'" class="modal">' +
                                '<h2>' + this.title + '</h2>' +
                                '<p class="minorDesc">' + this.description + "</p>" +
                                '<h3> Courses: </h3>' + 
                                '<ul class="minorClasses">';
            

            // Cycle through the courses array
            $.each(this.courses, function(index , elem){
                backModal += '<li>' + elem + '</li>'; 
            });

            
            // Only attach note at the bottom if it exists
            if(this.note){
                backModal += '</ul><p class="minorNote">*'+ this.note +'</p></div>';
            }
            else{
                backModal += '</ul></div>';
            }
            
            // Front modal - the part visible
            var frontModal = '<a href="#'+ this.name +'" rel="modal:open">' +
                                '<div class="eachMinor">'+
                                    '<p class="degreeName">' + this.title + '</p>' +
                                '</div>' +
                            '</a>';


                 
            $('#minors').append(frontModal); 
            $('#minors').append(backModal);          
        });
    });



    // Employment Section
    xhr('get', {path:"/employment/"}, "#employment").done(function(results){

        // Building of the employment section
        var employmentSect = '<div id="empContent">' +
                                '<p class="sectionHeading">' + results.introduction.title + '</p>' +
                                '<h3>' + results.introduction.content[0].title + '</h3>' +
                                '<p>' + results.introduction.content[0].description + '</p>' +
                            '</div>';


        // Iterate through the statistics
        $.each(results.degreeStatistics.statistics, function(){
            employmentSect += '<div id="empBoxes">' +
                                '<h2>' + this.value + '</h2>' +
                                '<p>' + this.description + '</p>'+
                            '</div>';
                            
        });


        // Coop Section
        var coopSect = '<div id="coopContent">' +
                            '<h3 style="padding-top: 1em;">' + results.introduction.content[1].title + '</h3>' +
                            '<p>' + results.introduction.content[1].description + '</p>' +
                        '</div>';
                            
        // append to dom
        $('#employment').append(employmentSect);
        $('#employment').append(coopSect);
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




