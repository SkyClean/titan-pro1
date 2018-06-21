const SHAPESHIFT_API_KEY_PUBLIC = 'ac3026cc62771151004214a06008adb8b93f89695d3b1c5e95b1c026d97cd05e1d6b78ca266f6ae476baf9f0e65d5f228d53468c9f54d52c8d627bf76e18fcd9';
const SHAPESHIFT_API_KEY_PRIVATE = '8d7a55ae7854586dc22e34cc41c28adcf15d2e1a8e80c42d1a5af81beb506cac158afbc34d37ead5d93939b35732ca9dd737f173351029ae285d078089da3776';

$('.overflow').click(function(){
  $('.Select-menu-outer').hide();
  $('.overflow').hide();
});

$('.Select-multi-value-wrapper .exchange-dropdown').click(function(){
  $('.Select-menu-outer').hide();
  $(this).closest(".Select-control").find('.Select-menu-outer').show();
  $('.overflow').show();
  $('.exchange-dropdown-available').find('.exchange-dropdown-text').removeClass('exchange-dropdown-disabled');
  $('.exchange-dropdown-available').find('.exchange-dropdown-image').removeClass('exchange-dropdown-disabled');
  if ($(this).closest("#exchange-give").length != 0){
    receive_coin = $('#exchange_receive_coin').val();
    if (!$('#exchange-give .exchange-dropdown-available.exchange-dropdown-'+receive_coin).find('.exchange-dropdown-text').hasClass('exchange-dropdown-disabled')){
      $('#exchange-give .exchange-dropdown-available.exchange-dropdown-'+receive_coin).find('.exchange-dropdown-text').addClass('exchange-dropdown-disabled');
      $('#exchange-give .exchange-dropdown-available.exchange-dropdown-'+receive_coin).find('.exchange-dropdown-image').addClass('exchange-dropdown-disabled');
    }
    console.log(receive_coin)
  } else {
    give_coin = $('#exchange_give_coin').val();
    if (!$('#exchange-receive .exchange-dropdown-available.exchange-dropdown-'+give_coin).find('.exchange-dropdown-text').hasClass('exchange-dropdown-disabled')){
      $('#exchange-receive .exchange-dropdown-available.exchange-dropdown-'+give_coin).find('.exchange-dropdown-text').addClass('exchange-dropdown-disabled');
      $('#exchange-receive .exchange-dropdown-available.exchange-dropdown-'+give_coin).find('.exchange-dropdown-image').addClass('exchange-dropdown-disabled');
    }
  }
});

$('.popover-button').click(function(){
  $('.popover-button').removeClass('active');
  $(".popover-button").removeClass(function (index, classNames) {
      var current_classes = classNames.split(" "), // change the list into an array
      classes_to_remove = []; // array of classes which are to be removed

      $.each(current_classes, function (index, class_name) {
        // if the classname begins with bg add it to the classes_to_remove array
        if (/exodus-color.*/.test(class_name)) {
          classes_to_remove.push(class_name);
        }

        if (/exodus-border.*/.test(class_name)) {
          classes_to_remove.push(class_name);
        }
      });
      // turn the array back into a string
      return classes_to_remove.join(" ");
  });
  give_coin = $('#exchange_give_coin').val();
  $(this).addClass('active');
  $(this).addClass('exodus-color-'+give_coin);
  $(this).addClass('exodus-border-color-'+give_coin);
});

$('#popover-button-all').click(function(){
  give_symbol = $('#exchange_give_coin_symbol').val();
  receive_symbol = $('#exchange_receive_coin_symbol').val();
  pair = give_symbol.toLowerCase() + '_' + receive_symbol.toLowerCase();
  give_coin = $('#exchange_give_coin').val();
  console.log('click popover button all');
  $.get('https://shapeshift.io/marketinfo/'+pair, function(data, status){
    console.log('marketinfo');
    if (status == 'success') {
      console.log('mareting info', data);
      max_limit = data.maxLimit;
      balance = $('#'+give_coin+'_balance').html();
      min = data.minimum;
      console.log('balance', balance);
      if (balance < max_limit){
        $('#exchange-give .cryptocurrency-input').val(balance);
        exchange_input_amount($('#exchange-give .cryptocurrency-input'));
      } else if (balance >= max_limit) {
        $('#exchange-give .cryptocurrency-input').val(max_limit);
        exchange_input_amount($('#exchange-give .cryptocurrency-input'));
      } else {
        $('#exchange-give .cryptocurrency-input').val('0.00');
        exchange_input_amount($('#exchange-give .cryptocurrency-input'));
      }
    }
  });
});

$('#popover-button-half').click(function(){
  give_symbol = $('#exchange_give_coin_symbol').val();
  receive_symbol = $('#exchange_receive_coin_symbol').val();
  pair = give_symbol.toLowerCase() + '_' + receive_symbol.toLowerCase();
  give_coin = $('#exchange_give_coin').val();
  console.log('click popover button all');
  $.get('https://shapeshift.io/marketinfo/'+pair, function(data, status){
    console.log('marketinfo');
    if (status == 'success') {
      max_limit = data.maxLimit;
      balance = $('#'+give_coin+'_balance').html();
      if (balance < max_limit){
        if (balance == 0) $('#exchange-give .cryptocurrency-input').val('0.00');
        else $('#exchange-give .cryptocurrency-input').val(balance/2);
        exchange_input_amount($('#exchange-give .cryptocurrency-input'));
      } else {
        if (max_limit == 0) $('#exchange-give .cryptocurrency-input').val('0.00');
        else $('#exchange-give .cryptocurrency-input').val(max_limit/2);
        exchange_input_amount($('#exchange-give .cryptocurrency-input'));
      }
    }
  });
});

$('#popover-button-min').click(function(){
  give_symbol = $('#exchange_give_coin_symbol').val();
  receive_symbol = $('#exchange_receive_coin_symbol').val();
  pair = give_symbol.toLowerCase() + '_' + receive_symbol.toLowerCase();
  give_coin = $('#exchange_give_coin').val();
  console.log('click popover button all');
  $.get('https://shapeshift.io/marketinfo/'+pair, function(data, status){
    console.log('marketinfo');
    if (status == 'success') {
      console.log('mareting info', data);
      min = data.minimum;
      if (min == 0) $('#exchange-give .cryptocurrency-input').val('0.00');
      else $('#exchange-give .cryptocurrency-input').val(min);
      exchange_input_amount($('#exchange-give .cryptocurrency-input'));
    }
  });
});

$('.Select-menu .exchange-dropdown').click(function(){
  if ($(this).find('.exchange-dropdown-text').hasClass('exchange-dropdown-disabled')){
    return;
  } else {
    title = $(this).find('.exchange-dropdown-title').html();
    console.log(title);
    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/exodus-color.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }

          if (/exodus-border.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown-text').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/exodus-color.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }

          if (/exodus-border.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown-image').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/logo.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }

        });
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    $(this).closest('.Select-control').find('.Select-multi-value-wrapper svg').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/exodus-color-fill-svg.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }

        });
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });
    coin = '';
    symbol = '';
    if (title == 'Bitcoin'){
      coin = 'bitcoin';
      symbol = 'BTC';
    } else if (title == 'Ethereum'){
      coin = 'ethereum';
      symbol = 'ETH';
    } else if (title == 'EOS'){
      coin = 'eos';
      symbol = 'EOS';
    } else if (title == 'Litecoin'){
      coin = 'litecoin';
      symbol = 'LTC';
    }

    $(this).closest('.Select-control').find('.exchange_coin').val(coin);
    $(this).closest('.Select-control').find('.exchange_coin_symbol').val(symbol);
    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown-image').addClass('logo-'+coin);
    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown-text').addClass('exodus-color-'+coin);
    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown').addClass('exodus-border-color-'+coin);
    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown-title').html(title);
    $(this).closest('.Select-control').find('.Select-multi-value-wrapper .exchange-dropdown-description').html('0.00 '+symbol);
    $(this).closest('.Select-control').find('.Select-multi-value-wrapper svg').addClass('exodus-color-fill-svg-' + coin);
    $('.Select-menu-outer').hide();
    $('.overflow').hide();

    $(".popover-button.active").removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/exodus-color.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }

          if (/exodus-border.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });

        console.log(classes_to_remove);
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    give_coin = $('#exchange_give_coin').val();
    give_coin_symbol =$('#exchange_give_coin_symbol').val();
    console.log(give_coin);

    receive_coin = $('#exchange_receive_coin').val();
    receive_coin_symbol =$('#exchange_receive_coin_symbol').val();

    $(".popover-button.active").addClass('exodus-color-'+give_coin);
    $(".popover-button.active").addClass('exodus-border-color-'+give_coin);

    $('.exchange-amount-group.exchange_receive .exchange-amount-coin .exchange-amount-units').html(receive_coin_symbol);
    $('.exchange-amount-group.exchange_give .exchange-amount-coin .exchange-amount-units').html(give_coin_symbol);

    $('.exchange-amount-group .exchange-amount-coin').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/exodus-color.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });

        console.log(classes_to_remove);
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    $('.exchange-amount-group .exchange-amount-baseline').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/exodus-bg-color.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });

        console.log(classes_to_remove);
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    $('.exchange-amount-group.exchange_receive .exchange-amount-coin').addClass('exodus-color-'+receive_coin);
    $('.exchange-amount-group.exchange_receive .exchange-amount-baseline').addClass('exodus-bg-color-'+receive_coin);

    $('.exchange-amount-group.exchange_give .exchange-amount-coin').addClass('exodus-color-'+give_coin);
    $('.exchange-amount-group.exchange_give .exchange-amount-baseline').addClass('exodus-bg-color-'+give_coin);

    $('#exchange-give-confirm-logo').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/logo.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });

        console.log(classes_to_remove);
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });
    $('#exchange-give-confirm-logo').addClass('logo-'+give_coin);
    $('#exchange-receive-confirm-logo').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/logo.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });

        console.log(classes_to_remove);
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    $('.exchange-confirm-amount').removeClass(function (index, classNames) {
        var current_classes = classNames.split(" "), // change the list into an array
        classes_to_remove = []; // array of classes which are to be removed

        $.each(current_classes, function (index, class_name) {
          // if the classname begins with bg add it to the classes_to_remove array
          if (/exodus-color.*/.test(class_name)) {
            classes_to_remove.push(class_name);
          }
        });

        console.log(classes_to_remove);
        // turn the array back into a string
        return classes_to_remove.join(" ");
    });

    $('#exchange-receive-confirm-logo').addClass('logo-'+receive_coin);
    $('#exchange-give-confirm-amount').addClass('exodus-color-'+give_coin);
    $('#exchange-receive-confirm-amount').addClass('exodus-color-'+receive_coin);
    $('#exchange-give-confirm-amount .code').html(give_coin_symbol);
    $('#exchange-receive-confirm-amount .code').html(receive_coin_symbol);
  }
});

var shapeshift = require('shapeshift.io')
shapeshift.coins(function (err, coinData) {
  console.dir('shapeshift',coinData);
});



var shapeshift_down = true;
function updateBalances(){
  $('#exchange-give .exchange-dropdown-title').each(function(){
    coin = '';
    title = $(this).html();
    if (title == 'Bitcoin'){
      coin = 'bitcoin';
      symbol = 'BTC';
    } else if (title == 'Ethereum'){
      coin = 'ethereum';
      symbol = 'ETH';
    } else if (title == 'EOS'){
      coin = 'eos';
      symbol = 'EOS';
    } else if (title == 'Litecoin'){
      coin = 'litecoin';
      symbol = 'LTC';
    }
    give_coin_balance = $('#'+coin+'_balance').html();
    $(this).closest('.exchange-dropdown-text').find('.exchange-dropdown-description').html(give_coin_balance + ' ' + symbol);
  });

  $('#exchange-receive .Select-multi-value-wrapper .exchange-dropdown-title').each(function(){
    var coin = '';
    title = $(this).html();
    if (title == 'Bitcoin'){
      coin = 'bitcoin';
      symbol = 'BTC';
    } else if (title == 'Ethereum'){
      coin = 'ethereum';
      symbol = 'ETH';
    } else if (title == 'EOS'){
      coin = 'eos';
      symbol = 'EOS';
    } else if (title == 'Litecoin'){
      coin = 'litecoin';
      symbol = 'LTC';
    }
    console.log('coin', coin);
    give_symbol = $('#exchange_give_coin_symbol').val();

    if (give_symbol == symbol){
      $('#exchange-receive .exchange-dropdown-text.exodus-color-'+coin).find('.exchange-dropdown-description').html('1 ' + give_symbol + ' = ' + ' 1 '+ ' ' + symbol);
      return;
    }
    pair = give_symbol.toLowerCase() + '_' + symbol.toLowerCase();

    console.log('pair', pair);
    $.get('https://shapeshift.io/rate/'+pair, function(data, status){
      if (status == 'success') {
        $('#exchange-receive .exchange-dropdown-text.exodus-color-'+coin).find('.exchange-dropdown-description').html('1 ' + give_symbol + ' = ' + data.rate + ' ' + symbol);
      }
    });
  });
  coins = ['bitcoin', 'litecoin', 'ethereum', 'eos'];

  for (i in coins){
      address = $('#'+coins[i]+'_wallet_address').html();
      $.get('https://shapeshift.io/txbyaddress/'+address+'/' + SHAPESHIFT_API_KEY_PRIVATE, function(data, status){
        if (status == 'success'){
          if (data.length != 0){
            if ($('body').find('.order').length > 0){
                $('#exch-loading').hide();
            }
            console.log('order-data',data);
            line = data.status + ' ' + data.inputCurrency + ':' + data.inputAmount + ' <> ' + data.outputCurrency + ':' + data.outputAmount;
            $('#exch-body--history').append('<div class="order">' + line + '</div>');
          }
        }
      });
  }

}

setInterval(updateBalances, 5000);


function exchange_input_amount(obj) {
  amount = $(obj).val();
  console.log('changed input:', amount);
  give_currency = $('.exchange_give .exchange-amount-coin .exchange-amount-units').html();
  receive_currency = $('.exchange_receive .exchange-amount-coin .exchange-amount-units').html();

  give_amount = amount;

  $('#exchange-give-confirm .amount-whole').html(Math.trunc(give_amount));

  decimal_give_amount = parseFloat(give_amount) - Math.trunc(give_amount);
  decimal_give_amount = decimal_give_amount.toString().substr(1);
  $('#exchange-give-confirm .amount-partial').html(decimal_give_amount);


  var pair = give_currency.toLowerCase() + '_' + receive_currency.toLowerCase();

  $.get('https://shapeshift.io/rate/'+pair, function(data, status){
    console.log(pair, 'rate', data.rate);
    receive_amount = give_amount * data.rate;
    $('.exchange_receive .exchange-amount').val(receive_amount);
    $('#exchange-receive-confirm .amount-whole').html(Math.trunc(receive_amount));
    decimal_receive_amount = parseFloat(receive_amount) - Math.trunc(receive_amount);
    decimal_receive_amount = decimal_receive_amount.toString().substr(1);
    $('#exchange-receive-confirm .amount-partial').html(decimal_receive_amount);

    receive_coin = $('#exchange_receive_coin').val();
    api = "https://api.coinmarketcap.com/v1/ticker/" + receive_coin;
    $.get(api, function(data, status){
      unitUSD = parseFloat(data[0]['price_usd']);
      priceUSD = unitUSD * receive_amount;
      $('.exchange_receive .exchange-amount-local-currency .currency-input').val(priceUSD.toFixed(2));
    });
  });

  give_coin = $('#exchange_give_coin').val();
  var api = "https://api.coinmarketcap.com/v1/ticker/" + give_coin;
  $.get(api, function(data, status){
    unitUSD = parseFloat(data[0]['price_usd']);
    priceUSD = unitUSD * give_amount;
    $('.exchange_give .exchange-amount-local-currency .currency-input').val(priceUSD.toFixed(2));
  });

  balance = $('#'+give_coin+'_balance').html();
  give_title = $('#exchange-give .Select-multi-value-wrapper .exchange-dropdown-title').html();
  if (amount > balance ) {
    $('#error-message').html('Not enough ' + give_title + ' to start this exchange.');
    $('#error-message-container').addClass('active');
    if ($('#exchange-button-exchange').hasClass('disabled')){
      $('#exchange-button-exchange').addClass('disabled');
    }
  } else {
    if (amount != 0){
      $('#exchange-button-exchange').removeClass('disabled');
    }
    $('#error-message-container').removeClass('active');
  }
}

var is_opened = false;
$('#exch-tab--history').click(function(){
    console.log('clicked');
    is_opened = !is_opened;
    if (is_opened){
      $('#exch-drawer').addClass('open');
    } else {
      $('#exch-drawer').removeClass('open');
    }
});


function exchange(){
  give_symbol = $('#exchange_give_coin_symbol').val();
  receive_symbol = $('#exchange_receive_coin_symbol').val();
  pair = give_symbol.toLowerCase() + '_' + receive_symbol.toLowerCase();
  give_coin = $('#exchange_give_coin').val();
  receive_coin = $('#exchange_receive_coin').val();
  give_balance = $('#'+give_coin+'_balance').html();
  receive_balance = $('#'+receive_coin+'_balance').html();
  give_amount = $('#exchange-give .cryptocurrency-input').val();
  receive_amount = $('#exchange-receive .cryptocurrency-input').val();
  give_wallet = $('#'+give_coin+'_wallet_address').html();
  receive_wallet = $('#'+receive_coin+'_wallet_address').html();

  console.log('exchange', give_balance, pair, receive_wallet, give_wallet);

  send_data = {
    withdrawal:receive_wallet,
    pair:pair,
    returnAddress:give_wallet,
    apiKey:SHAPESHIFT_API_KEY_PUBLIC
  };
  $.post('https://shapeshift.io/shift', send_data, function(data, status){
      if (status == 'success'){
        deposit_address = data.deposit;
        if (give_coin == 'bitcoin'){
          _sendbitcoin(give_balance, deposit_address, null);
          alert('exchange submitted');
        } else if (give_coin == 'ethereum'){
          _sendethereum(give_balance, deposit_address, null);
          alert('exchange submitted');
        } else if (give_coin == 'litecoin'){
          _sendlitecoin(give_balance, deposit_address, null);
          alert('exchange submitted');
        } else if (give_coin == 'eos'){
          _sendeos(give_balance, deposit_address, null);
          alert('exchange submitted');
        }
      }
  });
}
