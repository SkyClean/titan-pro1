
var providers = ethers.providers;
var Wallet = ethers.Wallet;

var myEOSWallet;

var tokenBalance = 0;
var eosBalance = 0;
var version = "0.0.1";

var necpUSD = 0;
var etherUSD = 0;

var provider = new providers.EtherscanProvider(false);

var tokenContract;
var TOKEN_ADDRESS = '0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0';
const TOKEN_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},
{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint128"}],"name":"push","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"name_","type":"bytes32"}],"name":"setName","outputs":[],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"wad","type":"uint128"}],"name":"mint","outputs":[],"payable":false,"type":"function"},
{"constant":true,"inputs":[{"name":"src","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},
{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"authority_","type":"address"}],"name":"setAuthority","outputs":[],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"wad","type":"uint128"}],"name":"pull","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"wad","type":"uint128"}],"name":"burn","outputs":[],"payable":false,"type":"function"},
{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"type":"function"},
{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},
{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"guy","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},
{"inputs":[{"name":"symbol_","type":"bytes32"}],"payable":false,"type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"name":"sig","type":"bytes4"},
{"indexed":true,"name":"guy","type":"address"},{"indexed":true,"name":"foo","type":"bytes32"},{"indexed":true,"name":"bar","type":"bytes32"},{"indexed":false,"name":"wad","type":"uint256"},
{"indexed":false,"name":"fax","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"authority","type":"address"}],"name":"LogSetAuthority","type":"event"},
{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"LogSetOwner","type":"event"},
{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},
{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},
{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);




function OpenEtherScan(txid) {
  shell.openExternal('https://etherscan.io/tx/'+txid)
}



function OpenMyEtherWallet() {
  shell.openExternal('https://www.myetherwallet.com')
}

function StorjPrice() {
  var api = "https://api.coinmarketcap.com/v1/ticker/storj/";
  $.get(api, function(data, status){
    necpUSD = parseFloat(data[0]['price_usd']);
  });
}

function EtherPrice() {
  var api = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
  $.get(api, function(data, status){
    etherUSD = parseFloat(data[0]['price_usd']);
  });
}


UpdatePricing();

function UpdatePricing() {
  EtherPrice();
  StorjPrice();
}



function CheckEOSAvailable() {
    var send = $("#send_eos_amount").val();
    var fee = $("#eostxfee").val();
    var spendable = tokenBalance - (send - fee);
    if (spendable >= 0) {
        $("#sendeosbutton").prop("disabled", false);
    } else {
        $("#sendeosbutton").prop("disabled", true);
    }
}

setInterval(function() {
    if (myEOSWallet) updateEOSBalance();
}, 5000);



function CopyCreatedAddress() {
    clipboardy.writeSync($('.created_myaddress').html());
    alert("Address Copied: " + $('.created_myaddress').html());
}


function QuitAppButton() {
    app.quit()
}


function updateEOSBalance() {
    var address = myEOSWallet.address;
    $("#eos_wallet_address").html(address);


    var callPromise = tokenContract.functions.balanceOf(address);
    callPromise.then(function(result) {
        var trueBal = result[0].toString(10);

        var messageEl = $('#eosbal');

        var n = trueBal * 0.000000000000000001;

        var atyxValue = n.toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            {
                minimumFractionDigits: 4
            }
        );

        var split = atyxValue.split(".");
        eosBalance = parseFloat(atyxValue);
        console.log('trueBal',result[0]);
        $(".eosspend").html(atyxValue)
        messageEl.html(split[0] + ".<small>" + split[1] + "</small>");
    });

}



function SuccessAccessEOS() {
    // $(".options").hide();
    // $(".walletInput").hide();
    // $(".walletInfo").attr("class", "row walletInfo");
    // $("#walletActions").attr("class", "row");
    $('#eos_wallet_address').html(myEOSWallet.address);
    const qr = new EthereumQRPlugin();

    const sendDetails = {
      to: myEOSWallet.address,
      value: eosBalance,
      gas: 42000
    };
    const configDetails = {
      size:180,
      selector: '#eos_qr_code',
      options: {
        margin: 2
      }
    };

    //run the plugin
    qr.toCanvas(sendDetails, configDetails);

}


function GetEOSGas() {
    var price = $("#eosgasprice").val();
    var gaslimit = 21000;
    var txfee = price * gaslimit;
    $("#eostxfee").val((txfee * 0.000000001).toFixed(5));
    UpdateAvailableEOS();
    return false;
}

var lastTranx;


function UpdateAvailableEOS() {
    var fee = $("#tokentxfee").val();
    var available = eosBalance - fee;
    CheckTokenAvailable();
    $(".ethavailable").each(function(){
      $(this).html(available.toFixed(6));
    });
}

function decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}

function SendEOS(callback) {
    var to = $('#send_eos_to').val();
    var amount = $('#send_eos_amount').val();
    $("#sendeosbutton").prop("disabled", true);
    var price = parseInt($("#eosgasprice").val()) * 1000000000;

    if (to != '' && amount != '' && parseFloat(amount) <= tokenBalance) {
        var targetAddress = ethers.utils.getAddress(to);
        myEOSWallet.provider = provider;
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, myEOSWallet);
        //d = decimalPlaces(amount);
        console.log('sending amount', amount);
        var a = new BN(amount, 10);
        console.log('a', a);
        var b = new BN('1000000000000000000', 10);
        console.log('b', b);
        amount = b.mul(a);
        console.log('price', price);
        console.log('amount', amount);
        //amount = Math.pow(10, d);
        //  amount = new BN('100000000000000000', 10);
        tokenContract.functions.transfer(targetAddress, amount, {
            gasPrice: price,
            gasLimit: 65000,
        }).then(function(txid) {
            console.log('txid', txid);
            $('#eosmodal').modal('hide')
            $("#sendeosbutton").prop("disabled", false);
            $(".txidLink").html(txid.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+txid.hash+"')");
            $("#senttxamount").html(amount);
            $("#txtoaddress").html(to);
            $("#txtype").html("EOS");
            $('#trxsentModal').modal('show');
            updateBalance();
        });
    }
}

function OpenEosPrivateKey(key="") {
    if (key == "")
      key = $("#privatepass").val();
    if (key.substring(0, 2) !== '0x') {
        key = '0x' + key;
    }
    if (key != '' && key.match(/^(0x)?[0-9A-fa-f]{64}$/)) {
        HideButtons();
        try {
            myEOSWallet = new Wallet(key);
            console.log("Opened: " + myEOSWallet.address)
        } catch (e) {
            console.error(e);
        }
        SuccessAccessEOS();
        updateEOSBalance();
    } else {
      $("#privatekeyerror").show();
    }
}

var eos_keyFile = 'keystore/eos-key.store';
$('document').ready(function(){
  walletData = '';
  var walletprivatekey = null;
  if (fs.existsSync(eos_keyFile)) {
    buffer = fs.readFileSync(eos_keyFile);
    walletprivatekey = buffer.toString();
  } else {

  }

  if (walletprivatekey){
    console.log('-----');
    OpenEosPrivateKey(walletprivatekey);
  }
  else {
    var api = 'https://api.blockcypher.com/v1/eth/main/addrs?token=4229aa6c1a434b10a7e889bb1bc6e731';
    console.log(api);
    $.post(api, function(data, status){
      console.log(data);
      console.log(data.private);
      console.log(data.address);
      fs.appendFile(eos_keyFile, data.private, function (err) {
        if (err) throw err;
        console.log('Saved!');
        OpenEosPrivateKey(data.private);
      });
    });
  }

  $('.eos-control-img').hover(function(){
    id = $(this).attr('id');
    if (id == "eos_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address_hover.png');
      $('#eos-subtitle').html('COPY THIS ADDRESS!')
    } else if (id == 'eos_email_address'){
      $(this).attr('src', '../images/ethereum_email_address_hover.png');
      $('#eos-subtitle').html('EMAIL THIS ADDRESS!')
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address_hover.png');
      $('#eos-subtitle').html('VIEW ON BLOCKCHAIN!');
    }
  },function(){
    id = $(this).attr('id');
    $('#eos-subtitle').html('YOUR EOS ADDRESS!')
    if (id == "eos_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address.png');
    } else if (id == 'eos_email_address'){
      $(this).attr('src', '../images/ethereum_email_address.png');
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address.png');
    }
  });

  $('.eos-control-img').click(function(){
    id = $(this).attr('id');
    if (id == "eos_copy_address"){
      CopyEthereumAddress();
      $('#eos-subtitle').html('ADDRESS COPIED TO CLIPBOARD!');
    } else if (id == 'eos_email_address'){
      var email = '';
      var subject = 'Titanwallet EOS Address';
      var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + "MY EOS ADDRESS is: " + myEOSWallet.address;
      win = window.open(mailto_link, 'emailWindow');
      if (win && win.open && !win.closed) win.close();
    } else if (id == 'eos_explorer_address'){
      shell.openExternal('https://etherscan.io/address/'+myEOSWallet.address);
    }
  });
})
