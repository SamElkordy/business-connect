$(function() {
    $("#search-input").autocomplete({
      source: function(request, response) {
        // Send a GET request to the server with the search query
        $.get("/listings?autocomplete=" + request.term, function(data) {
          // Transform the response data into an array of objects with a `value` property
          const suggestions = data.map(function(title) {
            return { value: title };
          });
          // Call the response function with the transformed suggestions array
          response(suggestions);
        });
      },
      select: function(event, ui) {
        // Redirect to the selected listing page when an option is selected
        window.location.href = "/listings?search=" + ui.item.value;
      },
      minLength: 2, // Minimum number of characters required to trigger autocomplete
      delay: 500 // Delay before sending the GET request (in milliseconds)
    });
  });
  