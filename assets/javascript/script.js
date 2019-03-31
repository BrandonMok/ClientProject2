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
    $("#people-tabs").tabs();

    // Accordian 
    $( "#accordion" ).accordion({
        active: false,
        collapsible: true
    });

    // // Carousel plugin - Slick
    // $('#carousel').slick({
    //     dots: true
    // });


    /**
     * About
     */
    xhr('get', {path:"/about/"}, '#about').done(function(results){
        var aboutSection = '<div id="about-Div" class="altSection">' +
                            '<p id="about-Title">' + results.title + '</p>' +
                            '<p id="about-Desc">' + results.description + '</p>' +
                        '</div>';

        var quoteSection = '<div id="quote-Div">'+
                        '<p id="quote"><span class="quotes">"</span>' + results.quote  + '<span class="quotes">"</span></p>' +
                        '<p id="quote-Author"> - ' + results.quoteAuthor + '</p>' +
                    '</div>';

        // append to DOM
        $("#about").append(aboutSection);
        $("#about").append(quoteSection);
    });



    /**
     * Degrees
     */
    xhr('get', {path:"/degrees/"}, '#degrees').done(function(results){

        // Undergraduate
        $.each(results.undergraduate, function(){
            // Front Modal - Back will only be loaded if clicked on
            var frontModal = '<a href="#mainModal" rel="modal:open">' +
                                '<div class="uDegBoxes" data-degree="'+ this.degreeName +'">'+
                                    '<p class="degree-name">' + this.title + '</p>' +
                                    '<p class="degree-Desc">' + this.description + '</p>' +
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
                var frontModal = '<a href="#mainModal" rel="modal:open">' +
                                    '<div class="gDegBoxes" data-degree="'+ this.degreeName +'">'+
                                        '<p class="degree-name">' + this.title + '</p>' +
                                        '<p class="degree-Desc">' + this.description + '</p>' +
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
            var frontModal = '<a href="#mainModal" rel="modal:open">' +
                                '<div class="each-minor" data-minor-name="'+this.name+'">'+
                                    '<p class="degree-name">' + this.title + '</p>' +
                                '</div>' +
                            '</a>';


            // append to dom - #minors-box-container is the container for the boxes that's inside #minors div
            $('#minors-box-container').append(frontModal); 
        });


        // Now get the information for this object
        $('.each-minor').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildMinorsBackModal(results.UgMinors, $(this).attr('data-minor-name'));
        });
    });



    /**
     * Employment Section - Brief Co-op & employment w/statistics
     */
    xhr('get', {path:"/employment/"}, "#employment").done(function(results){
        // Building of the employment section
        var employmentSect = '<div id="employment-content">' +
                                '<p class="section-heading">' + results.introduction.title + '</p>' +
                                '<h3>' + results.introduction.content[0].title + '</h3>' +
                                '<p>' + results.introduction.content[0].description + '</p>' +
                            '</div>';

        // Iterate through the statistics
        $.each(results.degreeStatistics.statistics, function(){
            employmentSect += '<div id="statistics-boxes">' +
                                '<h2>' + this.value + '</h2>' +
                                '<p>' + this.description + '</p>'+
                            '</div>';
        });
        


        // Coop Section
        var coopSect = '<div id="coop-content">' +
                            '<h3 style="padding-top: 1em;">' + results.introduction.content[1].title + '</h3>' +
                            '<p>' + results.introduction.content[1].description + '</p>' +
                        '</div>';
                      
                        
        // append to dom
        $('#employment').append(employmentSect);
        $('#employment').append(coopSect);
    });




    /**
     * Co-op/Employment section - Table/lists
     */
    xhr('get', {path:"/employment/"}, "#student-work-locations").done(function(results){
        // append titles to accordion plugin's tab
        $('#coop-table-title').append(results.coopTable.title);
        $('#employment-table-title').append(results.employmentTable.title);

        // var coopTableList = '<ul id="coopList">';
        var cTable = '<table id="coop-table">'+
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


        $('#coop-table-content').append(cTable);


        // Cycle through employment table list
        var employTable = '<ul id="employment-table">';
        $.each(results.employmentTable.professionalEmploymentInformation, function(){
            employTable += '<li>' + this.employer +'</li>';
        });
        employTable += '</ul>';

        $("#employment-table-content").append(employTable);
    });





    /**
     * People Section
     * Contains faculty & staff
     */
    xhr('get', {path:"/people/"}, "#people").done(function(results){
        // Our people title
        $('div#people p.section-heading').append(results.title);

        // Cycle through staff
        $.each(results.staff, function(){
            var frontModal = '<a href="#mainModal" rel="modal:open">' + 
                                '<div class="staff-boxes" data-uname="'+ this.username +'">' +
                                    '<h2>' + this.name + '</h2>' +
                                    '<h4>' + this.title + '</h4>' +
                                '</div>' +
                            '</a>';
            $('#tabs-4').append(frontModal);
        });


        // Cycle through Faculty
        $.each(results.faculty, function(){
            var frontModal = '<a href="#mainModal" rel="modal:open">'+
                            '<div class="faculty-boxes" data-uname="'+ this.username +'">' +
                                '<h2>' + this.name +'</h2>' +
                                '<h4>' + this.title + '</h4>' +
                            '</div>' +
                        '</a>';
            $('#tabs-3').append(frontModal); // append each faculty box to dom
        });



        // Now get the information for this object
        $('.staff-boxes').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildPeopleBackModal(results.staff, $(this).attr('data-uname'));
        });

        // Now get the information for this object
        $('.faculty-boxes').on('click', function(){
            // Pass in the query 'results.undergraduate' and the data attribute value
            buildPeopleBackModal(results.faculty, $(this).attr('data-uname'));
        });
    });




    /**
     * Research Interest Areas
     */
    xhr('get', {path:"/research/"}, '#research').done(function(results){
        // var carousel = '<div id="carousel">' + 
        //                     '<div id="byinterest-container"></div>' +
        //                     '<div id="byFaculty-container"></div>' +
        //                 '</div>'; 
        // $('#research').append(carousel);


        // byInterest area
        $.each(results.byInterestArea, function(){

            // CHECK: for white space
            if(this.areaName.indexOf(" ") > 0){

                // Front Modal
                var frontModal = '<a href="#mainModal" rel="modal:open">'+
                                    '<div class="interest-area-box" data-area-name="'+ this.areaName +'">' + 
                                        '<p>' + this.areaName + '</p>' +
                                    '</div>' +
                                '</a>';
                // append
                $('#research-container').append(frontModal);
            }
            else{
                // Front Modal
                var frontModal = '<a href="#mainModal" rel="modal:open">'+
                                    '<div class="interest-area-box" data-area-name="'+ this.areaName +'">' + 
                                        '<p>' + this.areaName + '</p>' +
                                    '</div>' +
                                '</a>';
                // append
                $('#research-container').append(frontModal);
            }
        });


        // byFaculty
        $('#research-container').append(document.createTextNode("By Faculty")); // TEMPORARY

        $.each(results.byFaculty, function(){
            var frontModal = '<a href="#mainModal" rel="modal:open">' + 
                                '<div class="interest-faculty-box"  data-faculty-name="' + this.username + '">' + 
                                    '<p>' + this.facultyName + '</p>' +
                                '</div>' +
                            '</a>';


            $('#research-container').append(frontModal);
        });

        // Carousel plugin - Slick
        // $('#carousel').slick({
        //     dots: true
        // });



        // On click event to then make the back modal
        $('.interest-area-box').on('click', function(){
            buildInterestBackModal(results.byInterestArea, 'areaName', $(this).attr('data-area-name'));
        });
        // On click event to then make the back modal
        $('.interest-faculty-box').on('click', function(){
            buildInterestBackModal(results.byFaculty, 'username', $(this).attr('data-faculty-name'));
        });
    });





    /**
     * Resources
     */
    xhr('get', {path:"/resources/"}, '#resources').done(function(results){
        $('div#resources p.section-heading').append(results.title); // append heading/title
        $('div#resources p.sub-heading').append(results.subTitle); // subheading

        // Study Abroad
        var studyAbroadFM = resourcesFrontModal(results.studyAbroad.title);

        // Student Services / Advising
        var studentServicesFM = resourcesFrontModal(results.studentServices.title);

        // Student Services / Advising
        var tutorsLabFM = resourcesFrontModal(results.tutorsAndLabInformation.title);

        // Coop - Enrollment
        var coopEnrollmentFM = resourcesFrontModal(results.coopEnrollment.title);

        // StudentAmbassadors 
        var studentAmbassadorsFM = resourcesFrontModal(results.studentAmbassadors.title);

        // Forms
        var formsFM = resourcesFrontModal(results.forms.title);


        // Append all divs to container
        $('#resources-container').append(studyAbroadFM);
        $('#resources-container').append(studentServicesFM);
        $('#resources-container').append(tutorsLabFM);
        $('#resources-container').append(coopEnrollmentFM);
        $('#resources-container').append(studentAmbassadorsFM);
        $('#resources-container').append(formsFM);


        // $('.resources-boxes').on('click', function(){

        // });


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
    var data = getAttributesByName(resultField, "degreeName", dataField);


    // CHECK: inital check for #mainModal (one main modal used for all)
    if( $('.modalflag').length > 0 ){

        clearModal(); // clear modal since there's content already

        // append new content
        var backModal = '<h2>' + data.title + '</h2>' +
                        '<p class="concentration-subheading">Concentrations:</p>' +
                        '<ul class="concentration-list">';

        $.each(data.concentrations, function(index , elem){
            backModal += '<li>' + elem + '</li>'; 
        });
        backModal += '</ul>';
        $('#mainModal').append(backModal); 
    }
    else{
        // CASE that the modal doesn't exist yet
        // Create new backmodal
        backModal = '<div id="mainModal" class="modal modalflag">' +
                        '<h2>' + data.title + '</h2>' +
                        '<p class="concentration-subheading">Concentrations:</p>' +
                        '<ul class="concentration-list">';
        $.each(data.concentrations, function(index , elem){
            backModal += '<li>' + elem + '</li>'; 
        });
        backModal += '</ul></div>';
        $('body').append(backModal); // stuff after - back
    }   
}



/**
 * buildMinorsBackModal
 * Builds the back modal for minors
 * @param resultField - E.g. "results.UgMinors"
 * @param dataField - Value of the data- attribute
 */
function buildMinorsBackModal(resultField, dataField){
    // Get object requested
    var data = getAttributesByName(resultField, "name", dataField);

    // CHECK: initial if modal exists already
    if( $('.modalflag').length > 0 ){

        clearModal(); // clear modal since there's content already

        // Backmodal - only appending content
        var backModal = '<h2>' + data.title + '</h2>' +
                            '<p class="minor-description">' + data.description + "</p>" +
                            '<h3> Courses: </h3>' + 
                            '<ul class="minor-courses">';

        // Cycle through the courses array
        $.each(data.courses, function(index , elem){
            backModal += '<li>' + elem + '</li>'; 
        });

        // Only attach note at the bottom if it exists
        if(data.note){
            backModal += '</ul><p class="minor-note">*'+ data.note +'</p>';
        }
        else{
            backModal += '</ul>';
        }

        $('#mainModal').append(backModal); // append back modal to the MAIN modal
    }
    else{
        // CASE: that there the main modal isn't created yet
        var backModal = '<div id="mainModal" class="modal modalflag">' +
                            '<h2>' + data.title + '</h2>' +
                            '<p class="minor-description">' + data.description + "</p>" +
                            '<h3> Courses: </h3>' + 
                            '<ul class="minor-courses">';

        // Cycle through the courses array
        $.each(data.courses, function(index , elem){
            backModal += '<li>' + elem + '</li>'; 
        });

        // Only attach note at the bottom if it exists
        if(data.note){
            backModal += '</ul><p class="minor-note">*'+ data.note +'</p></div>';
        }
        else{
            backModal += '</ul></div>';
        }

        $('body').append(backModal); // append back modal to the dom
    }
}





/**
 * buildPeopleBackModal
 * Builds the backModal for the people (faculty, staff)
 * @param resultField - E.g 'results.faculty'
 * @param dataField - Value of the data- attribute    
 */
function buildPeopleBackModal(resultField, dataField){
    // Get data object
    var data = getAttributesByName(resultField, "username", dataField);

    // BackModal - will add more elements
    // Used as a general variable to avoid repeated code
    var backModal = "";

    // CHECK: if backmodal exists
    if( $('.modalflag').length > 0 ){
        clearModal(); // clear modal contents 

        backModal = '<div id="people-container"><h1>' + data.name; // only adding content since mainmodal is there
    }
    else{
        // CASE: back modal doesn't exist //people-back-modal
        backModal = '<div id="mainModal" class="modal modalflag">' +  
                        '<div id="people-container">' +
                        '<h1>'+ data.name;
    }

    
    // CHECK: for tagline
    if(data.tagline != null && data.tagline != ""){
        // if tagline is present, add it
        backModal += " - " + data.tagline + '</h1>'; 
    }else{
        // NOT present, just close the tag
        backModal += '</h1>';
    }


    // Add rest of information
    backModal +=  '<div class="people-brief-info">' +
                        '<img src="'+ data.imagePath +'" style="max-width:150px;" >' +
                        '<h2>' + data.title +'</h2>';

    // CHECK: interest areas isn't null
    if(data.interestArea != null && data.interestArea != ""){
        backModal += '<p><strong>Interest Areas:</strong>  '  + data.interestArea + '</p></div>';
    }
    else{
       backModal += '</div>'; 
    }

    // next div
    backModal += '<div class="people-contact-info">';


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


    // CHECK: need to know if exists or not again to know which ending tags
    if( $('.modalflag').length > 0 ){
        backModal += '</div></div>';
        $('#mainModal').append(backModal);      // append back modal to the MAIN modal
    }
    else{
        backModal += '</div></div></div>';      // close divs
        $('body').append(backModal);            // append to the dom
    }
}



/**
 * buildResearch
 * Builds the back modal for minors
 * @param resultField - E.g. "results.byInterestArea"
 * @param jsonField - Field in api json to test dataField on
 * @param dataField - Value of the data- attribute
 */
function buildInterestBackModal(resultField, jsonField, dataField){
    // Check by jsonField (either 'username' or 'areaName')
    if(jsonField === "areaName"){
        // get the specific data object for the on clicked
        var data = getAttributesByName(resultField, jsonField, dataField);

        // BackModal
        var backModal = '';

        // CHECK: for existing modal
        if( $('.modalflag').length > 0 ){
            clearModal();
            backModal += '<h1>' + data.areaName + '</h1>' +
                            '<ul class="citation-list">';
        }else{
            backModal = '<div id="mainModal" class="modal modalFlag">' +
                            '<h1>'+ data.areaName + '</h1>' +
                            '<ul class="citation-list">';
        }

        // Loop through all the citations
        $.each(data.citations, function(index, elem){
            backModal += '<li>' + elem + '</li>';
        });
        backModal += '</ul>';


        if( $('.modalflag').length > 0 ){
            $('#mainModal').append(backModal);
        }
        else{
            backModal += '</div>';
            $('body').append(backModal); 
        }

    }
    else if(jsonField === "username"){ // case that it's for the faculty

        // get the specific data object for the on clicked
        var data = getAttributesByName(resultField, jsonField, dataField);

        var backModal = "";
        if( $('.modalflag').length > 0 ){
            clearModal();
            backModal +=  '<h1>'+ data.facultyName + '</h1>' +
                            '<ul class="citation-list">';
        }
        else{
            backModal = '<div id="mainModal" class="modal modalflag">' +
                            '<h1>'+ data.facultyName + '</h1>' +
                            '<ul class="citation-list">';
        }

        // Loop through all the citation
        $.each(data.citations, function(index, elem){
            backModal += '<li>' + elem + '</li>';
        });
        backModal += '</ul>'; // close tags
        

        if( $('.modalflag').length > 0 ){
            $('#mainModal').append(backModal);
        }
        else{
            backModal += '</div>';
            $('body').append(backModal); 
        }
    }
}






/** 
 * clearModal
 * Clears the modal - only called if modal exists
 */
function clearModal(){
    // Remove its contents
    $.each($('#mainModal').children(), function(){
        $(this).remove();
    });
}


/**
 * resourcesFrontModal
 * function to build the front modals of the resources section
 * @param queryField - section of json wanted (i.e. results.forms.title)
 */
function resourcesFrontModal(queryField){
    return '<a href="#mainModal" rel="modal:open">' +
                '<div id="#' + queryField + '" class="resources-boxes" data-section="'+ queryField +'">' +
                    '<p>' + queryField + '</p>' +
                '</div>' +
            '</a>';
}

