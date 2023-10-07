$(() => {
  // retrieve places from api
  getPlaces();
  // Initialize an empty array to store selected amenities
  let amenity_list = [];

  // Event handler for changes in checkbox state
  $('.amenities input[type="checkbox"]').change((e) => {
    // Retrieve the Amenity ID and name from the data attributes of the clicked checkbox
    const amenity_id = $(e.target).data('id');
    const amenity_name = $(e.target).data('name');

    // Check if the checkbox is checked
    if (e.target.checked) {
      // If checked, add the Amenity ID and name as an object to the amenity_list array
      amenity_list.push({ id: amenity_id, name: amenity_name });
    } else {
      // If unchecked, filter out the Amenity with the matching ID from the amenity_list
      amenity_list = amenity_list.filter((amenity) => amenity.id !== amenity_id);
    }

    // Call the updateAmenity function to refresh the displayed selected amenities
    updateAmenity();
  });

  // Make an AJAX GET request to check the status of an API endpoint
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
    // Check if the API status is 'OK'
    if (data.status === 'OK') {
      // Add the 'available' class to the <div> element with the ID 'api_status'
      $('div#api_status').addClass('available');
    } else {
      // Remove the 'available' class from the <div> element with the ID 'api_status'
      $('div#api_status').removeClass('available');
    }
  });

  $('.filters button[type="button"]').click(() => {
    list = amenity_list.map((amenity) => amenity.id);
    getPlaces({ amenities: list });
  });

  /** ******************************** auxillary functions *******************************************/

  // Function to update the displayed list of selected amenities
  function updateAmenity () {
    // Map the selected amenity objects to their names and join them with commas
    const selectedAmenities = amenity_list.map((amenity) => amenity.name).join(', ');

    // Set the text of the <h4> element within the '.amenities' element to the selected amenities
    $('.amenities h4').text(selectedAmenities);
  }

  // Function to Make an AJAX POST request to retrieve data from
  // the 'http://0.0.0.0:5001/api/v1/places_search/' endpoint

  function getPlaces (param = {}) {
    $('section.places').empty();
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify(param), // Send an empty JSON object as the request body
      contentType: 'application/json', // Set the content type to JSON
      success: (data) => { // Success callback function when the request is successful
        // Loop through the retrieved data and create HTML elements for each place
        data.forEach((place) => {
          const article = $('<article>'); // Create a new <article> element

          // Populate the <article> element with place information using template literals
          article.html(`
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">
            ${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}
          </div>
          <div class="number_rooms">
            ${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}
          </div>
          <div class="number_bathrooms">
            ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}
          </div>
        </div>
        <div class="user">
          <b>Owner:</b>
        </div>
        <div class="description">
          ${place.description}
        </div>
      `);

          // Append the created <article> element to the '.places' section
          $('section.places').append(article);
        });
      },
      error: (error) => { // Error callback function in case the request fails
        console.error('Error occurred: ', error);
      }
    });
  }
});
