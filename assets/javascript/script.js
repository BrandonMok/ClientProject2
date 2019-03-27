/**
 * Brandon Mok
 * Javascript - Project 2
 */

$(document).ready(function(){
    // Browser Detection Plugin - https://github.com/danieledesantis/jquery-browser-detection
    var curBrowser = $.browserDetection(true);
    switch(curBrowser){
        case "IE7":
            alert("Outdated browser detected! Please update browser before viewing page!");
            window.location = "http://outdatedbrowser.com/en";
            break;
    }

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



    /**
     * Minors section
     */
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



    /**
     * Employment Section
     */
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





    /**
     * People Section
     * Contains faculty & staff
     */
    xhr('get', {path:"/people/"}, "#people").done(function(results){
        // Our people title
        $('div#people p.sectionHeading').append(results.title);

        // Cycle through staff
        $.each(results.staff, function(){
            var staff = '<a href="#'+this.username+'" rel="modal:open">' +
                    '<div class="staffBoxes" data-uname="'+this.username+'">' +
                        '<h2>' + this.name + '</h2>' +
                        '<h4>' + this.title + '</h4>' +
                    '</div>';
            $('#tabs-4').append(staff);
        });


        // Cycle through Faculty
        $.each(results.faculty, function(){
            var faculty = '<a href="#'+this.username+'" rel="modal:open">'+
                            '<div class="facultyBoxes" data-uname="'+this.username+'">' +
                                '<h2>'+this.name+'</h2>' +
                                '<h4>' + this.title + '</h4>' +
                            '</div>'
                        '</a>';
            $('#tabs-3').append(faculty); // append each faculty box to dom
        });




        // Now get the information for this object
        $('.staffBoxes').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildPeopleBackModal(results.staff, $(this).attr('data-uname'));
        });

        // Now get the information for this object
        $('.facultyBoxes').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildPeopleBackModal(results.faculty, $(this).attr('data-uname'));
        });
    });




});







/**
 * buildDegreeBackModal
 * Builds the back modal for the degrees section
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



/**
 * buildMinorsBackModal
 * Builds the back modal for minors
 * @param resultField - E.g. "results.UgMinors"
 * @param dataField - Value of the data- attribute
 */
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

    $('body').append(backModal); // append back modal to the dom
}



/**
 * buildPeopleBackModal
 * Builds the backModal for the people (faculty, staff)
 * @param resultField - E.g 'results.faculty'
 * @param dataField - Value of the data- attribute    
 */
function buildPeopleBackModal(resultField, dataField){
    var data = getAttributesByName(resultField, "username", dataField);

    var backModal = '<div id="'+ data.username +'" class="modal peopleBackModal">' +
                        '<h1>'+ data.name;
    
    // CHECK: for tagline
    if(data.tagline != null && data.tagline != ""){
        backModal += " - " + data.tagline + '</h1>';
    }else{
        backModal += '</h1>';
    }

    // Add rest of information
    backModal +=  '<div class="peopleNameImage">' +
                        '<img src="'+ data.imagePath +'" style="max-width:150px;" />' +
                        '<h2>' + data.title +'</h2>';

    // CHECK: interest areas
    if(data.interestArea != null && data.interestArea != ""){
        backModal += '<p><strong>Interest Areas:</strong>  '  + data.interestArea + '</p></div>';
    }
    backModal += '<div class="peopleContactInfo">';


    // CHECK: phone number
    if(data.phone != null && data.phone != ""){
        var originalPhone = data.phone; // orignal phone number from api

        if(originalPhone.indexOf("(") >= 0 || originalPhone.indexOf(")") >= 0){
            backModal += '<h4><i class="fas fa-mobile-alt"></i>' + originalPhone + '</h4>';
        }
        else if(originalPhone.indexOf("-") >= 0){
            backModal += '<h4><i class="fas fa-mobile-alt"></i> ('+ originalPhone.substring(0,3) + ')' + originalPhone.substring(3, 12) + '</h4>';
        }
        else if(originalPhone.indexOf("-") < 0){ // check if phone number doesn't have the dash
            backModal += '<h4><i class="fas fa-mobile-alt"></i>' +
                "(" + originalPhone.substring(0,3) + ") " + originalPhone.substring(3,6) + " - " + originalPhone.substring(6,10) + '</h4>';
        }
    }

    // CHECK: email 
    if(data.email != null && data.email != ""){
        backModal += '<h4><i class="far fa-envelope"></i>' + data.email + '</h4>';
    }

    // CHECK: office
    if(data.office != null && data.office != ""){
        backModal += '<h4><i class="far fa-building"></i>' + data.office + '</h4>';
    }
    backModal += '</div></div>';    // close divs
    $('body').append(backModal);
}



