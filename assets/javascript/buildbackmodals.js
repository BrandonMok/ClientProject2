/**
 * Brandon Mok
 * Contains functions to build all backmodals
 */

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
 * buildDegreeBackModal
 * Builds the back modal for the degrees section
 * @param resultField - E.g. "results.undergraduate"
 * @param dataField - Value of the data- attribute
 */
function buildDegreeBackModal(resultField, dataField){
    // get the requested object
    var data = getAttributesByName(resultField, "degreeName", dataField);

    var backModal = "";

    // CHECK: inital check for #mainModal (one main modal used for all)
    if( $('.modalflag').length > 0 ){
        clearModal(); // clear modal since there's content already

        // append new content
        backModal = '<h2>' + data.title + '</h2>' +
                        '<p class="concentration-subheading">Concentrations:</p>' +
                        '<ul class="concentration-list">';
    }
    else{
        // CASE that the modal doesn't exist yet
        // Create new backmodal
        backModal = '<div id="mainModal" class="modal modalflag">' +
                        '<h2>' + data.title + '</h2>' +
                        '<p class="concentration-subheading">Concentrations:</p>' +
                        '<ul class="concentration-list">';
    }
    
    
    $.each(data.concentrations, function(index , elem){
        backModal += '<li>' + elem + '</li>'; 
    });


    // Check again to know which closing tags and where to append
    if( $('.modalflag').length > 0 ){
        backModal += '</div>';
        $('#mainModal').append(backModal);
    }
    else{
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
            backModal += '</li></div>';
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
            backModal = '<div id="mainModal" class="modal modalflag">' +
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

        // CHECK: if modal exists
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
 * buildNewsBackModal
 * Builds the back modal for the news section in the footer
 * @param queryField - ( i.e. results.news )
 */
function buildNewsBackModal(queryField){
    var backModal = "";
    var modalCheck = false;
    
    // CHECK: if modal exists already
    if( $('.modalflag').length > 0 ){
        clearModal();
        modalCheck = true;
    }
    else{
        // Case that modal DOESN'T EXIST
        backModal = '<div id="mainModal" class="modal modalflag">';
    }


    // Cycle through news
    $.each(queryField.older, function(){
        // append news information 
        backModal += '<p class="news-titles">' + this.title + '</p>' +
                        '<p class="news-timestamp">' + this.date.substring(0,10) + '</p>';

        // CHECK: if description is null.
        // If null, don't include description
        if(this.description != null){
            backModal += '<p>' + this.description + '</p>';
        }
    });

     
    // Check again to know which closing tags to add
    if( modalCheck == true ){
        $('#mainModal').append(backModal);
    }
    else{
        backModal += '</div>';
        $('body').append(backModal);
    }
}






/** RESOURCES SECTION */


/**
 * buildStudyAbroadModals
 * @param dataObject - results object (i.e. results.studyAbroad)
 */
function buildStudyAbroadBackModals(dataObject){
    var studyAbroadBM = '';

    if( $('.modalflag').length > 0 ){
        clearModal();
        studyAbroadBM += '<h2>' + dataObject.title + '</h2>' +
                            '<p>' + dataObject.description + '</p>';
    }else{
        studyAbroadBM += '<div id="mainModal" class="modal modalflag">' +
                            '<h2>' + dataObject.title + '</h2>' +
                            '<p class="study-abroad-description">' + dataObject.description + '</p>';
    }

    $.each(dataObject.places, function(){
        studyAbroadBM += '<h3>' + this.nameOfPlace + '</h3>' +
            '<p class="study-abroad-description">' + this.description + '</p>';
    });

    if( $('.modalflag').length > 0 ){
        $('#mainModal').append(studyAbroadBM);
    }
    else{   
        studyAbroadBM += '</div>';
        $('body').append(studyAbroadBM);
    }
}


/**
 * buildAdvisingBackModal
 * @param dataObject - (results.studentServices)
 */
function buildAdvisingBackModal(dataObject){
    var studentServicesBM = '';
    var check = false;

    if( $('.modalflag').length > 0){
        clearModal();
        check = true;
        studentServicesBM += '<h2>' + dataObject.title + '</h2>';
    }else{
        studentServicesBM += '<div id="mainModal" class="modal modalflag">';
    }

    // Academic Advisors
    studentServicesBM += '<div id="academic-advisors">' +
                            '<h2>' + dataObject.academicAdvisors.title + '</h2>' +
                            '<p>' + dataObject.academicAdvisors.description + '</p>' +
                            '<a href="'+dataObject.academicAdvisors.faq.contentHref+'" target="_blank" id="advising-faq-link">' +
                                '<h3>' + dataObject.academicAdvisors.faq.title +'</h3>' +
                            '</a>' +
                        '</div>';

    // Professional Advisors
    studentServicesBM += '<div id="professonal-advisors">' +
                            '<h2>' + dataObject.professonalAdvisors.title + '</h2>';

    $.each(dataObject.professonalAdvisors.advisorInformation, function(){
        studentServicesBM +=  '<div id="prof-advisor-info">' +
                                '<h3>' + this.name + '</h3>' +
                                '<p id="advisor-department">' + this.department + '</p>' +
                                '<p><strong>' + this.email + '</strong></p>' +
                            '</div>';
    });
    studentServicesBM += '</div>';



    // Faculty Advisors
    studentServicesBM += '<div id="faculty-advisors">'+
                            '<h2>' + dataObject.facultyAdvisors.title + '</h2>' +
                            '<p>' + dataObject.facultyAdvisors.description + '</p>' +
                        '</div>';
    
    studentServicesBM += '<div id="ist-minor-advising">' +
                            '<h2>' + dataObject.istMinorAdvising.title + '</h2>';

    $.each(dataObject.istMinorAdvising.minorAdvisorInformation, function(){
        studentServicesBM += '<div class="minor-advisor-info">' +
                                '<h4>' + this.title + '</h4>' +
                                '<p>' + this.advisor + '</p>' +
                                '<p>' + this.email + '</p>' +
                            '</div>';
    });
    studentServicesBM += '</div>';


    if(check == true){
        $('#mainModal').append(studentServicesBM);
    }
    else{
        studentServicesBM += '</div>';
        $('body').append(studentServicesBM);
    }
}



/**
 * buildTutorsBackModal
 * @param dataObject  - (i.e. results.tutorsAndLabInformation )
 */
function buildTutorsBackModal(dataObject){
    var backModal = '';
    if( $('.modalflag').length > 0 ){
        clearModal();
        backModal += '<h2>' + dataObject.title + '</h2>' +
                        '<p>' + dataObject.description + '</p>' +
                        '<a href="'+dataObject.tutoringLabHoursLink+'" target="_blank">' +
                            '<p id="lab-hours-link">Lab Hours</p>' +
                        '</a>';

        $('#mainModal').append(backModal);
    }else{
        backModal += '<div id="mainModal" class="modal modalflag">' +
                        '<h2>' + dataObject.title + '</h2>' +
                        '<p>' + dataObject.description + '</p>' +
                        '<a href="'+dataObject.tutoringLabHoursLink+'" target="_blank">' +
                            '<p id="lab-hours-link">Lab Hours</p>' +
                        '</a>' +
                    '</div>';
        $('body').append(backModal);
    }
}


/**
 * buildStudentAmbassadorsBackModal
 * @param dataObject  - (i.e. results.studentAmbassadors)
 */
function buildStudentAmbassadorsBackModal(dataObject){
    var backModal = '';
    var modalCheck = false;

    if( $('.modalflag').length > 0 ){
        clearModal();
        modalCheck = true;
        backModal += '<h2>' + dataObject.title + '</h2>' +
                        '<img src="'+ dataObject.ambassadorsImageSource+'" alt="student ambassadors" title="student ambassadors">';          
    }
    else{
        backModal += '<div id="mainModal" class="modal modalflag">' +
                        '<h2>' + dataObject.title + '</h2>' +
                        '<img src="'+ dataObject.ambassadorsImageSource+'" alt="student ambassadors" title="student ambassadors">';          
    }

    // Iterate through the subcontent
    $.each(dataObject.subSectionContent, function(){
        backModal += '<div class="sa-subcontent">' +
                        '<h2>' + this.title + '</h2>' +
                        '<p>' + this.description + '</p>' +
                    '</div>';
    });

    // Application form link
    backModal += '<a href="'+ dataObject.applicationFormLink +'" target="_blank">' +
                    '<div id="sa-apply">Apply</div>' +
                '</a>' +
                '<p id="sa-note">*' + dataObject.note + '</p>';
                    
    if( modalCheck == true){
        $('#mainModal').append(backModal);
    }   
    else{
        backModal += '</div>';
        $('body').append(backModal);
    }

}


/**
 * buildFormsBackModal
 * @param dataObject - (results.form)
 */
function buildFormsBackModal(dataObject){
    var backModal = '';
    var modalCheck = false;


    if( $('.modalflag').length > 0 ){
        clearModal();
        modalCheck = true;
        backModal +=  '<h2>Forms</h2>';
    }
    else{
        backModal += '<div id="mainModal" class="modal modalflag">' +
                        '<h2>Forms</h2>';
    }

    // Graduate forms
    backModal += '<p class="form-title">Graduate Forms</p>';
    $.each(dataObject.graduateForms, function(){
        backModal += '<span class="graduateForms">' +
                        '<a href="'+ this.href +'" target="_blank">' +
                          '<p class="form-names">' + this.formName + '</p>' +
                        '</a>' +
                    '</span>';
    });

    // Undergraduate forms
    backModal += '<p class="form-title">Undergraduate Forms</p>' +
                    '<a href="'+ dataObject.undergraduateForms[0].href +'" target="_blank">' +
                        '<p class="form-names">' + dataObject.undergraduateForms[0].formName + '</p>' +
                    '</a>';


    if(modalCheck == true){
        $('#mainModal').append(backModal);
    }
    else{
        backModal += '</div>';
        $('body').append(backModal);
    }
}



/**
 * buildEnrollmentBackModal
 * @param dataObject - (results.coopEnrollment)
 */
function buildEnrollmentBackModal(dataObject){
    var backModal = '';
    var modalCheck = false;
    if( $('.modalflag').length > 0){
        clearModal();
        modalCheck = true;
        backModal += '<h2>' + dataObject.title +'</h2>';
    }
    else{
        backModal += '<div id="mainModal" class="modal modalflag">' +
                        '<h2>' + dataObject.title +'</h2>';
    }

    // Enrollment content
    $.each(dataObject.enrollmentInformationContent, function(){
        backModal += '<div class="enrollment-info">' +
                        '<h3>' + this.title + '</h3>' +
                        '<p>' + this.description + '</p>' +
                    '</div>';
    });

    // LINK
    backModal += '<a href="'+dataObject.RITJobZoneGuidelink+'" target="_blank">' +
                    '<p id="enrollment-job-zone-link">RIT Job Zone Guide</p>' +
                '</a>';


    if(modalCheck == true){
        $('#mainModal').append(backModal);
    }
    else{
        backModal += '</div>';
        $('body').append(backModal);
    }
}