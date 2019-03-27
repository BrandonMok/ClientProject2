/**
 * Brandon Mok
 * Javascript - Project 2
 */

$(document).ready(function(){

    // Tabs 
    $( "#tabs" ).tabs();
    $("#peopleTabs").tabs();

    // Accordian 
    $( "#accordion" ).accordion({
        active: false,
        collapsible: true
    });




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

        // Undergraduate
        $.each(results.undergraduate, function(){
            // Front Modal - Back will only be loaded if clicked on
            var frontModal = '<a href="#'+this.degreeName+'" rel="modal:open">' +
                                    '<div class="uDegBoxes" data-degree="'+this.degreeName+'">'+
                                        '<p class="degreeName">' + this.title + '</p>' +
                                        '<p class="degreeDesc">' + this.description + '</p>' +
                                        '<i class="far fa-plus-square"></i>' +
                                    '</div>' +
                                '</a>';

            //Append to dom
            $('#tabs-1').append(frontModal); // The modal itself - front
       });


       // Graduate
       $.each(results.graduate, function(){
            // Only make ones that have a title
            if(this.title){

                // Only showing front modal until clickec on
                var frontModal = '<a href="#'+this.degreeName+'" rel="modal:open">' +
                                    '<div class="gDegBoxes" data-degree="'+this.degreeName+'">'+
                                        '<p class="degreeName">' + this.title + '</p>' +
                                        '<p class="degreeDesc">' + this.description + '</p>' +
                                        '<i class="far fa-plus-square"></i>' +
                                    '</div>' +
                                '</a>';


                $('#tabs-2').append(frontModal); // append front
            }  
       });
       

        // Now get the information for this object
        $('.uDegBoxes').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildDegreeBackModal(results.undergraduate, $(this).attr('data-degree'));
        });

        // Now get the information for this object
        $('.gDegBoxes').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildDegreeBackModal(results.graduate, $(this).attr('data-degree'));
        });
    });



    // Minors Section
    xhr('get', {path:"/minors/"}, '#minors').done(function(results){
        // Iterate through each minor
        $.each(results.UgMinors , function(){
            
            // Front modal - the part visible
            var frontModal = '<a href="#'+ this.name +'" rel="modal:open">' +
                                '<div class="eachMinor" data-minor-name="'+this.name+'">'+
                                    '<p class="degreeName">' + this.title + '</p>' +
                                '</div>' +
                            '</a>';


            // append to dom - #minorsBoxCont is the container for the boxes that's inside #minors div
            $('#minorsBoxCont').append(frontModal); 
        });


        // Now get the information for this object
        $('.eachMinor').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildMinorsBackModal(results.UgMinors, $(this).attr('data-minor-name'));
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


    // Co-op/Employment section
    xhr('get', {path:"/employment/"}, "#studentWorkLocations").done(function(results){
        // append titles to accordion plugin's tab
        $('#cTableTitle').append(results.coopTable.title);
        $('#eTableTitle').append(results.employmentTable.title);

        // var coopTableList = '<ul id="coopList">';
        var cTable = '<table id="coopTable">'+
                        '<tr>'+
                            '<th>Degree</th>'+
                            '<th>Employer</th>' +
                            '<th>Title</th>'+
                            '<th>City</th>' +
                            '<th>Start Date</th>'+
                        '</tr>'; 

        // Cycle through CO-OP table information
        $.each(results.coopTable.coopInformation, function(){
            cTable += '<tr>' +
                        '<td>' + this.degree +'</td>'+
                        '<td>' + this.employer + '</td>' +
                        '<td>' + this.city +'</td>' +
                        '<td>' + this.term + '</td>' +
                       '</tr>';

            // coopTableList += '<hr/><li>' + this.employer + 
            //             // + this.degree + '</span>' + 
            //             // ' + this.city + '</span>' + 
            //             // '+ this.term + '</span>' + 
            //             '</li>';
        });
        // coopTableList += '</ul>';
        cTable += '</table>';


        $('#coopTableContent').append(cTable);
        // $('#coopTableContent').append(coopTableList);


        // Cycle through employment table list
        var employTableList = '<ul id="employList">';
        $.each(results.employmentTable.professionalEmploymentInformation, function(){
            employTableList += '<li>' + this.employer +'</li>';
        });
        employTableList += '</ul>';

        $("#employmentTableContent").append(employTableList);
    });





    // People section
    xhr('get', {path:"/people/"}, "#people").done(function(results){
        $('div#people p.sectionHeading').append(results.title);

        $.each(results.faculty, function(){
            var people = '<a href="#'+this.username+'" rel="modal:open">'+
                            '<div class="peopleBoxes" data-uname="'+this.username+'">' +
                                '<h2>'+this.name+'</h2>' +
                                '<h4>' + this.title + '</h4>' +
                            '</div>'
                        '</a>';
            $('#tabs-3').append(people);

        });

    });



    



});



/**
 * buildDegreeBackModal
 * @param resultField - E.g. "results.undergraduate"
 * @param dataField - Value of the data- attribute
 */
function buildDegreeBackModal(resultField, dataField){
    // get the requested object
    var temp = getAttributesByName(resultField, "degreeName", dataField);

    // console.log(temp);
    var backModal = '<div id="'+ temp.degreeName +'" class="modal">' +
        '<h2>' + temp.title + '</h2>' +
        '<p class="conSubHeading">Concentrations:</p>' +
        '<ul class="conList">';

        $.each(temp.concentrations, function(index , elem){
            backModal += '<li>' + elem + '</li>'; 
        });
    backModal += '</ul></div>';

    
    $('body').append(backModal); // stuff after - back
}


function buildMinorsBackModal(resultField, dataField){
    var data = getAttributesByName(resultField, "name", dataField);

    var backModal = '<div id="'+ data.name +'" class="modal">' +
            '<h2>' + data.title + '</h2>' +
            '<p class="minorDesc">' + data.description + "</p>" +
            '<h3> Courses: </h3>' + 
            '<ul class="minorClasses">';


    // Cycle through the courses array
    $.each(data.courses, function(index , elem){
        backModal += '<li>' + elem + '</li>'; 
    });


    // Only attach note at the bottom if it exists
    if(data.note){
     backModal += '</ul><p class="minorNote">*'+ data.note +'</p></div>';
    }
    else{
        backModal += '</ul></d>';
    }

    $('body').append(backModal);
}
