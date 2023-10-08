$(() => {
  // Initial retrieval of places from the API
  getPlaces();

  // Initialize arrays to store selected amenities, states, and cities
  let amenity_list = [];
  let state_list = [];
  let city_list = [];

  // Event handler for changes in checkbox state for amenities
  $('.amenities input[type="checkbox"]').change((e) => {
    const amenity_id = $(e.target).data('id');
    const amenity_name = $(e.target).data('name');

    if (e.target.checked) {
      amenity_list.push({ id: amenity_id, name: amenity_name });
    } else {
      amenity_list = amenity_list.filter((amenity) => amenity.id !== amenity_id);
    }

    updateAmenity();
  });

  // Event handler for changes in checkbox state for states
  $('.state > input[type="checkbox"]').change((e) => {
    const state_id = $(e.target).data('id');
    const state_name = $(e.target).data('name');
    console.log(state_id);

    if (e.target.checked) {
      state_list.push({ id: state_id, name: state_name });
    } else {
      state_list = state_list.filter((state) => state.id !== state_id);
    }

    updateState();
    // const checkBoxes = $(`.city > input[data-state="${state_id}"]`);
    // if (e.target.checked) {
    //   checkBoxes.prop('checked', true);
    // } else {
    //   checkBoxes.prop('checked', false);
    // }
  });

  // Event handler for changes in checkbox state for cities
  $('.city > input[type="checkbox"]').change((e) => {
    const city_id = $(e.target).data('id');
    const city_name = $(e.target).data('name');

    if (e.target.checked) {
      city_list.push({ id: city_id, name: city_name });
    } else {
      city_list = city_list.filter((city) => city.id !== city_id);
    }

    updateCity();
  });

  // Make an AJAX GET request to check the status of an API endpoint
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  // Event handler for the search button
  $('.filters button[type="button"]').click(() => {
    const a_list = amenity_list.map((amenity) => amenity.id);
    const s_list = state_list.map((state) => state.id);
    const c_list = city_list.map((city) => city.id);

    getPlaces({ amenities: a_list, states: s_list, cities: c_list });
  });

  // Event handler for clicks on the "show/hide" span
  $('section.places').on('click', '.reviews .showHide', (e) => {
    const $reviewItem = $(e.target).closest('.reviews').find('.review_item');
    // Toggle the text of the clicked span
    $(e.target).text((index, text) => {
      if (text === 'show') {
        const reviewsUrl = `http://0.0.0.0:5001/api/v1/places/${$(e.target).data('id')}/reviews`;
        $.getJSON(reviewsUrl, (data) => {
          data.forEach((review) => {
            const date = new Date(review.updated_at);
            const months = [
              'January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December'
            ];
            const userUrl = `http://0.0.0.0:5001/api/v1/users/${review.user_id}`;
            $.getJSON(userUrl, (data) => {
              userName = `${data.first_name} ${data.last_name}`;
              newReview.html(`
            <h3>From ${userName} the ${date.getDate()}th ${months[date.getMonth()]} ${date.getFullYear()}</h3>
            <p class="review_text">${review.text}</p>
              `);
              $reviewItem.append(newReview);
            });
            const newReview = $('<div>');
          });
        });
        $reviewItem.show();
        $(e.target).text('hide');
      } else {
        $reviewItem.hide();
        $(e.target).text('show');
      }
    });
  });

  // Function to update the displayed list of selected amenities
  function updateAmenity () {
    const selectedAmenities = amenity_list.map((amenity) => amenity.name).join(', ');
    $('.amenities h4').text(selectedAmenities);
  }

  // Function to update the displayed list of selected states
  function updateState () {
    const selectedStates = state_list.map((state) => state.name).join(', ');
    $('.locations h4').text(selectedStates);
  }

  // Function to update the displayed list of selected cities
  function updateCity () {
    const selectedCities = city_list.map((city) => city.name).join(', ');
    $('.locations h4').text(selectedCities);
  }

  // Function to make an AJAX POST request to retrieve data from the API
  function getPlaces (param = {}) {
    // Clear the existing places before retrieving new ones
    $('section.places').empty();
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify(param),
      contentType: 'application/json',
      success: (data) => {
        data.forEach((place) => {
          const article = $('<article>');
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
        <div class="reviews">
                <h2 class="article_subtitle">Reviews<span class="showHide" data-id="${place.id}">show</span></h2>
                <ul>
                    <li>
                        <div class="review_item">
                        </div>
                    </li>
                </ul>
            </div>

          `);
          $('section.places').append(article);
          $('.review_item').hide();
        });
      },
      error: (error) => {
        console.error('Error occurred: ', error);
      }
    });
  }
});
