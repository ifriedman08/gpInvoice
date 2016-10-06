$(document).ready(function(){

  var getTotal = function(){
    var total = 0;
    $('td.subtotal').each(function(el){
      // console.log(this.innerHTML);
      total += Number(this.innerHTML);
    })
    return total;
  }

  var setTotal = function(num){
    $('p#total').text(num);
  }

  var setInputChecker = function(){
    $('table td.small input,td.medium input,td.large input').on('change', function(event){
      event.preventDefault();
      var newValue = this.value;
      if (!isNumber(newValue) && newValue != '0') {
        $(this).addClass('error');
        alert('You must enter a number.')
      } else {
        $(this).removeClass('error');
        var thisRow = $(this.parentElement.parentElement);
        var numSmall = Number(thisRow.find('.small input').val());
        var numMedium = Number(thisRow.find('.medium input').val());
        var numLarge = Number(thisRow.find('.large input').val());
        var total = (70 * numLarge) + (60 * numMedium) + (50 * numSmall);
        thisRow.find('.subtotal').html(total);
        setTotal(getTotal());
      }
    })
  }

  $(document).on('click', 'button#add_row', function(event){
    event.preventDefault();
    console.log('new row');
    var newRow = $(`<tr class="input_row">
    <td class="address">
    <input type="text" name="name" value="">
    </td>
    <td class="large">
    <input type="text" name="name" value="0">
    </td>
    <td class="medium">
    <input type="text" name="name" value="0">
    </td>
    <td class="small">
    <input type="text" name="name" value="0">
    </td>
    <td class="subtotal">0</td>
    <td><button class="remove_row">Remove</td>
    </tr>'`);
    $('table').append(newRow);
    setInputChecker();
  })
  $(document).on('click', 'button.remove_row', function(event){
    event.preventDefault();
    this.parentElement.parentElement.remove();
  })

  $(document).on('click', 'button#submit', function(event){
    event.preventDefault();
    console.log('submitted');
  })

  var isNumber = function(value){
    return !!Number(value);
  }

  setInputChecker();

  var generateJSON = function(){
    var dataObj = {};

    dataObj.date = (new Date).toDateString();

    dataObj.total = Number($('p#total').text());

    dataObj.locations = [];

    if ($('input#name').val() === "") {
      alert('Enter name of billee.');
      return false;
    } else {
      dataObj.billee = $('input#name').val();
    }

    $('td.address > input').each(function(){
      if(this.value === ""){
        alert("Can't leave address blank.")
        return false;
      }
    })

    if ($('.error').length > 0) {
      alert('Fix errors in red first.')
      return false;
    } else {
      $('tr').not('#headers').each(function(el){
        var thisRow = $(this);
        var thisLocation = {};
        thisLocation['small'] = Number(thisRow.find('.small input').val());
        thisLocation['medium'] = Number(thisRow.find('.medium input').val());
        thisLocation['large'] = Number(thisRow.find('.large input').val());
        thisLocation['address'] = thisRow.find('.address input').val();
        thisLocation['subtotal'] = Number(thisRow.find('.subtotal').text());
        dataObj.locations.push(thisLocation);
      })
    }
    console.log(dataObj);
    return(dataObj);
  }
  $('button#submit').click(function(){
    localStorage.gpInvoiceData = JSON.stringify(generateJSON());
    window.open('invoice.html')
  });
})
