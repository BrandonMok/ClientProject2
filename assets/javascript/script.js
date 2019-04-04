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

    // Scroll plugin - makes scrolling smooth for nav options
    $('#nav a').smoothScroll();


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
            var frontModal = '<a href="#mainModal" rel="modal:open" class="degree-anchor">' +
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
                var frontModal = '<a href="#mainModal" rel="modal:open" class="degree-anchor">' +
                                    '<div class="gDegBoxes" data-degree="'+ this.degreeName +'">'+
                                        '<p class="degree-name">' + this.title + '</p>' +
                                        '<p class="degree-Desc">' + this.description + '</p>' +
                                        '<i class="far fa-plus-square"></i>' +
                                    '</div>' +
                                '</a>';

                $('#tabs-2').append(frontModal); // append front
            }  
            else{
                // Case of only degree without a title
                // It's the certificates section
                var certificates = '<div id="certificates-container">' +
                        '<h1>' + this.degreeName + '</h1>';

                $.each(this.availableCertificates, function(index, elem){
                    certificates += '<p>' + elem + '</p>';
                });
                certificates += '</div>';
                $('#degrees').append(certificates);
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
            var frontModal = '<a href="#mainModal" rel="modal:open" id="minors-anchor">' +
                                '<div class="each-minor" data-minor-name="'+this.name+'">'+
                                    '<p class="degree-name">' + this.title + '</p>' +
                                    '<i class="fas fa-plus-circle"></i>' +
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


        // Co-op Section
        var coopSect = '<div id="coop-content">' +
                            '<h3 style="padding-top: 1em;">' + results.introduction.content[1].title + '</h3>' +
                            '<p>' + results.introduction.content[1].description + '</p>' +
                        '</div>';

        

        // Employers - random employers shown
        var employers = '<div id="employers-div">' +
                            '<h3>' + results.employers.title + '</h3>';

        $.each(results.employers.employerNames, function(index, elem){
            employers += '<span class="employer-names-span">' + elem + '</span>';
        });
        employers += '</div>';


        // var careers 
        var careers = '<div id="careers-div">' +
                        '<h3>' + results.careers.title + '</h3>';
        $.each(results.careers.careerNames, function(index, elem){
            careers += '<span class="careers-names-span">' + elem + '</span>';
        });
        careers += '</div>';
        

                      
        // append to dom
        $('#employment').append(employmentSect);
        $('#employment').append(coopSect);
        $('#employment').append(employers);
        $('#employment').append(careers);
    });




    /**
     * Co-op/Employment section - Table/lists
     */
    xhr('get', {path:"/employment/"}, "#student-work-locations").done(function(results){
        // append titles to accordion plugin's tab
        $('#coop-table-title').append(results.coopTable.title);
        $('#employment-table-title').append(results.employmentTable.title);

        var cTable = '<table id="coop-table">'+
                        '<tr>'+
                            '<th>Degree</th>'+
                            '<th>Employer</th>' +
                            '<th>Location</th>'+
                            '<th>Term</th>' +
                        '</tr>'; 
        
        // Cycle through CO-OP table information
        $.each(results.coopTable.coopInformation, function(){
            cTable += '<tr>' +
                        '<td>' + this.degree +'</td>'+
                        '<td>' + this.employer + '</td>' +
                        '<td>' + this.city +'</td>' +
                        '<td>' + this.term + '</td>' +
                       '</tr>';
        });
        cTable += '</table>';

        // append table
        $('#coop-table-content').append(cTable);



        // Cycle through employment table list
        var employTable = '<table id="employment-table">'+
                            '<tr>'+
                                '<th>Degree</th>'+
                                '<th>Employer</th>' +
                                '<th>Location</th>'+
                                '<th>Title</th>' +
                                '<th>Term</th>' +
                            '</tr>'; 

        // cycle through employment table
        $.each(results.employmentTable.professionalEmploymentInformation, function(){
            employTable += '<tr>' + 
                                '<td>' + this.degree + '</td>' +
                                '<td>' + this.employer + '</td>' +
                                '<td>' + this.city + '</td>' +
                                '<td>' + this.title + '</td>' +
                                '<td>' + this.startDate + '</td>' +
                            '</tr>';
        });
        employTable += '</table>'; // close tags
        

        // append employment table to accordian
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
            var frontModal = '<a href="#mainModal" rel="modal:open" id="people-anchor">' + 
                                '<div class="staff-boxes" data-uname="'+ this.username +'">' +
                                    '<h2>' + this.name + '</h2>' +
                                    '<p>' + this.title + '</p>' +
                                '</div>' +
                            '</a>';
            $('#tabs-4').append(frontModal);
        });


        // Cycle through Faculty
        $.each(results.faculty, function(){
            var frontModal = '<a href="#mainModal" rel="modal:open" id="people-anchor">'+
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
        // byInterest area
        $.each(results.byInterestArea, function(){
            // Front Modal
            var frontModal = '<a href="#mainModal" rel="modal:open" id="interest-anchor">'+
                                '<div class="interest-area-box" data-area-name="'+ this.areaName +'">' + 
                                    '<p>' + this.areaName + '</p>' +
                                '</div>' +
                            '</a>';

            $('#research-for-mobile-areas').append(frontModal); // append to mobile div (Not shown originally)
            $('#flex-slide1').append(frontModal);// append to main display slider
            // $('#research-box-container').append(frontModal);
        });


        // byFaculty
        $.each(results.byFaculty, function(){
            var frontModal = '<a href="#mainModal" rel="modal:open" id="interest-anchor">' + 
                                '<div class="interest-faculty-box"  data-faculty-name="' + this.username + '">' + 
                                    '<p>' + this.facultyName + '</p>' +
                                '</div>' +
                            '</a>';


            $('#research-for-mobile-faculty').append(frontModal);   // append to mobile div (Not shown originally)
            $('#flex-slide2').append(frontModal);   // append to main display slider
            // $('#research-box-container').append(frontModal);
        });

        // On click event to then make the back modal
        $('.interest-area-box').on('click', function(){
            buildInterestBackModal(results.byInterestArea, 'areaName', $(this).attr('data-area-name'));
        });
        // On click event to then make the back modal
        $('.interest-faculty-box').on('click', function(){
            buildInterestBackModal(results.byFaculty, 'username', $(this).attr('data-faculty-name'));
        });

    });

    /** Research area's slider  */
    $('.flexslider').flexslider({
        slideshow: false
    });




    /**
     * Resources
     */
    xhr('get', {path:"/resources/"}, '#resources').done(function(results){
        $('div#resources p.section-heading').append(results.title); // append heading/title
        $('div#resources p.sub-heading').append(results.subTitle); // subheading

        // STUDY ABROAD
        var studyAbroadFM = buildResourcesFrontModal(results.studyAbroad.title, 'studyAbroad');
        $('#resources-container').append(studyAbroadFM);
        $('#studyAbroad').on('click', function(){
            buildStudyAbroadBackModals(results.studyAbroad);
        });

        // STUDENT SERVICES / ADVISING
        var advising = buildResourcesFrontModal(results.studentServices.title, 'advising');
        $('#resources-container').append(advising);      
        $('#advising').on('click', function(){
            buildAdvisingBackModal(results.studentServices);
        }); 

        // TUTORS AND LAB INFORMATION
        var tutorsLabInfo = buildResourcesFrontModal(results.tutorsAndLabInformation.title, 'tutorsLab');
        $('#resources-container').append(tutorsLabInfo);      
        $('#tutorsLab').on('click', function(){
            buildTutorsBackModal(results.tutorsAndLabInformation);
        });
      

        // STUDENT AMBASSADORS
        var studentAmb = buildResourcesFrontModal(results.studentAmbassadors.title, 'student-ambassadors');
        $('#resources-container').append(studentAmb);      
        $('#student-ambassadors').on('click', function(){
            buildStudentAmbassadorsBackModal(results.studentAmbassadors);
        });

        
        // FORMS
        var forms = buildResourcesFrontModal(results.forms.title, 'forms');
        $('#resources-container').append(forms);      
        $('#forms').on('click', function(){
            buildFormsBackModal(results.forms);
        });
        

        // COOP ENROLLMENT
        var coopEnrollment = buildResourcesFrontModal(results.coopEnrollment.title, 'coop-enrollment');
        $('#resources-container').append(coopEnrollment);      
        $('#coop-enrollment').on('click', function(){
             buildEnrollmentBackModal(results.coopEnrollment);
        });
    });



    /**
     * Footer
     */
    xhr('get', {path:"/footer/"}, '#footer').done(function(results){
        // Social section
        var socialSect = '<div id="social">' +
                            '<h2>' + results.social.title + '</h2>' +
                            '<p>' + results.social.tweet + '</p>' +
                            '<p>' + results.social.by + '</p><br />' +
                            '<a href="'+results.social.twitter+'" target="_blank">' +
                                '<i class="fab fa-twitter social-links"></i>' +
                            '</a>' +
                            '<a href="'+ results.social.facebook +'" target="_blank">' +
                                '<i class="fab fa-facebook-f social-links" ></i>'+
                            '</a>'+
                        '</div>';

        // Link section
        var links = '<div id="quickLinks">';
        $.each(results.quickLinks, function(){
            links += '<a href="'+ this.href +'" title="'+ this.title +'" target="_blank" id="footer-link-anchor">' +
                        '<div id="link-boxes">' +
                            '<p class="each-link">' + this.title + '</p>' +
                        '</div>' +
                    '</a>';
        });
        links += '</div>';


        // copyright section
        var copyright = '<div id="copyright">' +
                            '<h3>' + results.copyright.title + '</h3>' +
                            '<p>' + results.copyright.html + '</p>' +
                        '</div>';         
                        

        // Appending to dom
        $('#footer-social-container').append(socialSect);
        $('#footer-info-container').append(links);
        $('#footer-info-container').append(copyright);
    });



    // NEWS section - apart of footer
    xhr('get', {path:"/news/"}, '#footer').done(function(results){
        var frontModal = '<a href="#mainModal" rel="modal:open">' +
                            '<div id="news" data-news="news">'+
                                '<p id="news-word">News</p>' +
                            '</div>' +
                        '</a>';
        $('#footer-info-container').append(frontModal); // append to footer

        $('#news').on('click', function(){
            buildNewsBackModal(results);
        });
    });
    
});







/**
 * buildResourcesFrontModal
 * @param dataTitle - title of the results object
 * @param resID     - ID given for onclick to work
 */
function buildResourcesFrontModal(dataTitle, resID){
    var frontModal = '';

    // Only undefined for the 'FORMS' seciton
    if(dataTitle == undefined){
        frontModal += '<a href="#mainModal" rel="modal:open" id="resources-anchor">' +
                        '<div class="resources-boxes" id="'+ resID +'">' +
                            '<p class="resources-box-titles">Forms</p>' +
                        '</div>'+
                    '</a>';
    }
    else{
        frontModal += '<a href="#mainModal" rel="modal:open" id="resources-anchor">' +
                        '<div class="resources-boxes" id="'+ resID +'" data-rname="'+ dataTitle +'">' +
                            '<p class="resources-box-titles">' + dataTitle + '</p>' +
                        '</div>'+
                    '</a>';
    }

    return frontModal;
}