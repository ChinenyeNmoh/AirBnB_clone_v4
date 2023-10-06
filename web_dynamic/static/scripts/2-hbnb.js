$(() => {
  // Initialize an empty array to store selected amenities
  let amenity_list = [];

  // Function to update the displayed list of selected amenities
  const updateAmenity = () => {
    // Map the selected amenity objects to their names and join them with commas
    const selectedAmenities = amenity_list.map((amenity) => amenity.name).join(', ');

    // Set the text of the <h4> element within the '.amenities' element to the selected amenities
    $('.amenities h4').text(selectedAmenities);
  };

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
});
