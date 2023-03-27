$(function () {

  let key = '';
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "key.txt", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      key = xhr.responseText;
    }
  };
  xhr.send();
  console.log(key)


  // wow animate input


  $("input").click(function () {
    $(this).addClass("wow pulse animated");
    $(this).attr("style", "visibility: visible; animation-name: pulse ;");
    $(this).data("data-wow-iteration", 52)
  });
  // wow animate input


  
  // form validation
  $("#submitButton").click(function () {

    // personal info
    var days = $("#days").val();
    console.log(days)

    var destination = $("#destination").val();
    console.log(destination)

    var budget = $("#budget").val();
    console.log(budget)

    var restaurant = $("#restaurant").val();
    console.log(restaurant)

    var things = $("#things").val();
    console.log(things)

    prompt = `
    Give me a ${days} day ${destination} itinerary in detail for a budget of ${budget} a day and include ${restaurant}. I will do these things ${things} during the trip. Also include cost incured for every event.
    `

    var inputsForValidate = $('.valid');

    var value = check(inputsForValidate);
    if (value) {

      var url = "https://api.openai.com/v1/completions";

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader(
        "Authorization",
        `Bearer ${key}`
      );

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          document.querySelector(
            "#loader").style.visibility = "hidden";
          console.log(xhr.status);
          console.log(xhr.responseText);
          let response = xhr.responseText;
          response = JSON.parse(response);

          console.log(response);
          var output1=response["choices"][0]["text"];

          document.getElementById("output").innerHTML = output1
            
        }
      };

      if (prompt) {
        prompt = JSON.parse(JSON.stringify(prompt));
      }

      var data = {
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 3200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      };

      data = JSON.stringify(data);

      xhr.send(data);
      document.querySelector(
        "#loader").style.visibility = "visible";
    }

  });



}); // documet ready end line





// form validation function
function check(inputsForValidate) {
  var result = true;
  var firstFailedInput = null;
  var flagForFirstFailedInput = 0;



  inputsForValidate.each(function (i) {

    $(this).removeClass('valid-error');

    if ($(this).is(':visible')) {
      if ($(this).val().trim().length == 0) {
        $(this).addClass('valid-error');
        result = false;
        if (flagForFirstFailedInput == 0) {
          firstFailedInput = $(this);
          flagForFirstFailedInput = 1;
        }

      }
    }


  });

  if (firstFailedInput != null) {
    $('html, body').animate({
      scrollTop: firstFailedInput.offset().top
    }, 700);
  }

  return result;
}
