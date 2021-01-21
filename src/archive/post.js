authenticate(datum) {
	// Fire off the request to /form.php
	// request = $.ajax({
	//     type: "POST",
	//     //the url where you want to sent the userName and password to
	//     url: '../saveJSONerr.php',
	//     dataType: 'json',
	//     //json object to sent to the authentication url
	//     data: {"datum": datum}
	// });

	// // Callback handler that will be called on success
	// request.done(function (response, textStatus, jqXHR){
	//     // Log a message to the console
	//     console.log("Hooray, it worked!");
	// });

	// // Callback handler that will be called on failure
	// request.fail(function (jqXHR, textStatus, errorThrown){
	//     // Log the error to the console
	//     console.error(
	//         "The following error occurred: "+
	//         textStatus, errorThrown
	//     );
	// });

	// // Callback handler that will be called regardless
	// // if the request failed or succeeded
	// request.always(function () {
	//     // Reenable the inputs
	//     $inputs.prop("disabled", false);
	// });

	return fetch("../saveJSONerr.php", {
            method: "POST",
            cache: "no-cache",
            data: datum,
        })
            .then(response => response.text())
            .then(response => {
                const r = JSON.parse(response);
                if(r.code !== 200)
                    onError(response);
                else
                    callback(r);
            })
            .catch(error => onError(error));

}