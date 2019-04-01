// AJAX utility
// args:
// 		getPost 			(is this for a get or a post)
// 		d - data			(path:'/about/')
// 		[idForSpinner]	(#parent (if I want a spinner to show up while it is loading))
// return: 
//		ajax object
// 	use:
//		xhr('get', {path:'/degrees/'}, #parent).done(function(json){})
function xhr(getPost, d, idForSpinner){
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




// getAttributesByName 
// arr - an array of objects [{},{},{}]
// name - name of the name=value pair's object I want to send back
// val - value of the name=value pair I want

// [{x=1, y=1, z=1},{x=2, y=2, z=2}] -
// getAttributesByName(arr, 'x', 1)
function getAttributesByName(arr, name, val){
    var result = null;

    $.each(arr, function(){
        if(this[name] === val){
            result = this;
        }
    });

    return result;
}