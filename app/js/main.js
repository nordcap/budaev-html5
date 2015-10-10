;
(function($) {
    "use strict";

    $(window).load(function() {
        console.log('load');
    });


    $(document).ready(function() {

        console.log('ready');


        //activate WOW.js
        new WOW().init();

        var waypoints = $('.way').waypoint(function(direction) {
            console.log('Отработана библиотека waypoints.js');
        });


        var waypoints1 = $('.way').waypoint({
            handler: function() {
                    console.log('Отработана библиотека waypoints.js');
            },
            offset: '80%'
        });



            $('.magnific-popup .image-link').magnificPopup({type:'image'});


        var form = $('#form-contact'); // Get the form
        var formMessages = $('#form-messages'); // Get the div to print the form messages


        // Set up an event listener for the contact form.
        $(form).on('submit', function(event) {
            // Stop the browser from submitting the form and refresh the page.
            event.preventDefault();

            // Serialize the form data.
            var formData = $(form).serializeArray();

            // Submit the form using AJAX.

            $.ajax({
                type: "POST",
                url: $(form).attr('action'),
                data: formData,
                dataType: "json",
                success: function(data) {

                    if (data.success) {

                        // if we receive a success message from the PHP
                        $(formMessages).html('<div class="alert-success">' +
                            '<a href="#closeMsg">' +
                            '<i class="fa fa-close"></i>' +
                            '</a><strong>УСПЕХ!</strong>' +
                            '<br/>' + data.message + '</div>');

                        // Clear the form
                        $('#phone').val('');


                    } else {
                        if (data.errors.message) {

                            // There was a problem sending the form
                            $(formMessages).html('<div class="alert-error">' +
                                '<a href="#closeMsg">' +
                                '<i class="fa fa-close"></i>' +
                                '</a><strong>ОШИБКА!</strong>' +
                                '<br/>' + data.errors.message + '</div>');

                        } else {

                            // The form has validation errors
                            $(formMessages).html('<div class="alert-error">' +
                                '<a href="#closeMsg">' +
                                '<i class="fa fa-close"></i>' +
                                '</a><strong>ОШИБКА!</strong>' +
                                '<br/></div>');


                            if (data.errors.phone) {
                                $(formMessages).children().append(data.errors.phone + "<br/>");
                            }


                        }
                    }
                },
                error: function(jqXHR, status, errorThrown) {
                    // If there is an error in submitting the form send out a message
                    $(formMessages).html('<div class="alert-error">' +
                        '<a href="#closeMsg">' +
                        '<i class="fa fa-close"></i>' +
                        '</a><strong>ОШИБКА!</strong>' +
                        '<br/>' +
                        'Возникла неустановленная ошибка при отправки данных формы!' +
                        '<br/>' + errorThrown + '</div>');
                }
            });
        });

    }); //end ready




})(jQuery);
