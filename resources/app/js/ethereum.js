var EthereumQRPlugin = require('ethereum-qr-code');

var providers = ethers.providers;
var Wallet = ethers.Wallet;

var myWallet;

var tokenBalance = 0;
var ethBalance = 0;
var version = "0.0.1";

var etherUSD = 0;

var provider = new providers.EtherscanProvider(false);

function BackEthereum(){
  $('#created_myaddress').html('');
  $('#created_privatepass').val('');
  $('.ethereum-div').hide();
  $('#ethereum-div-first').show();
}
var privatekey;
function CreateEthereumWallet(){
  var api = 'https://api.blockcypher.com/v1/eth/main/addrs?token=4229aa6c1a434b10a7e889bb1bc6e731';
  $.post(api, function(data, status){
    console.log(data);
    //etherUSD = parseFloat(data[0]['price_usd']);
    console.log(data.private);
    console.log(data.address);
    $("#created_addressArea").attr("class", "row");
    $('.created_myaddress').html('0x' + data.address);
    $('.created_privatekey').html(data.private);
    $('.ethereum-div').hide();
    $('#ethereum-div-third').show();
  });
}


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


function UpdatePortfolio() {
  setTimeout(function() {
    var totalStorj = tokenBalance * necpUSD;
    var totalEth = ethBalance * etherUSD;
    var totalPort = totalStorj + totalEth;
    // $("#portNeurealUSD").html("($"+necpUSD+")");
    // $("#portEthUSD").html("($"+etherUSD+")");
    // $("#portfolioNeureal").html(totalStorj.toFixed(2))
    // $("#portfolioEth").html(totalEth.toFixed(2))
    // $("#portfolioTotal").html(totalPort.toFixed(2))
    // $(".portfolio").fadeIn('fast');
  }, 3500);
}



function CheckETHAvailable() {
    var send = $("#send_ether_amount").val();
    var fee = $("#ethtxfee").val();
    var spendable = ethBalance - (send - fee);
    if (spendable >= 0) {
        $("#sendethbutton").prop("disabled", false);
    } else {
        $("#sendethbutton").prop("disabled", true);
    }
}


setInterval(function() {
    if (myWallet) updateBalance();
}, 5000);

setInterval(function() {
    if (myWallet) UpdatePortfolio();
}, 30000);

function UseKeystore() {
    HideButtons();
    $("#keystoreupload").attr("class", "");
}

function UsePrivateKey() {
    HideButtons();
    $("#privatekey").attr("class", "");
}

function UseNewWallet() {
    HideButtons();
    $("#createnewwallet").attr("class", "");
}


function CopyEthereumAddress() {
    clipboardy.writeSync(myWallet.address);
    //alert("Address Copied: " + myWallet.address);
}

function CopyPrivateKey() {
  clipboardy.writeSync($('#section-coin-ethereum .created_privatekey').html());
  alert("Private Key Copied: " + $('#section-coin-ethereum .created_privatekey').html());
}

function CopyCreatedAddress() {
  clipboardy.writeSync($('#section-coin-ethereum .created_myaddress').html());
  alert("Address Copied: " + $('#section-coin-ethereum .created_myaddress').html());
}


function HideButtons() {
    $("#keystoreupload").attr("class", "hidden");
    $("#createnewwallet").attr("class", "hidden");
    $("#privatekey").attr("class", "hidden");
}


function QuitAppButton() {
    app.quit()
}


function OpenEthereumPrivateKey(key="") {
    if (key == "")
      key = $("#privatepass").val();
    if (key.substring(0, 2) !== '0x') {
        key = '0x' + key;
    }
    if (key != '' && key.match(/^(0x)?[0-9A-fa-f]{64}$/)) {
        HideButtons();
        try {
            myWallet = new Wallet(key);
            console.log("Opened: " + myWallet.address)
        } catch (e) {
            console.error(e);
        }
        SuccessAccess();
        updateBalance();
        UpdatePortfolio();
    } else {
      $("#privatekeyerror").show();
    }
}


function OpenEthereumNewWallet() {
    var pass = $("#newpass").val();
    var passconf = $("#newpassconf").val();
}



function updateBalance() {
    var address = myWallet.address;
    console.log('address', address);
    $("#ethereum_wallet_address").html(address);

    provider.getBalance(address).then(function(balance) {
        var etherString = ethers.utils.formatEther(balance);
        console.log("ETH Balance: " + etherString);
        var n = parseFloat(etherString);
        var ethValue = n.toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            {
                minimumFractionDigits: 4
            }
        );
        var messageEl = $('#eth_balance');
        var split = ethValue.split(".");
        ethBalance = parseFloat(ethValue);
        messageEl.html(split[0] + ".<small>" + split[1] + "</small>");
    });
}



var eth_keyFile = 'keystore/ethereum-key.store';
function OpenKeystoreFile() {
    dialog.showOpenDialog(function(fileNames) {
        if (fileNames === undefined) return;
        keyFile = fileNames[0];
        console.log(keyFile);
    });
}


function SuccessAccess() {
    // $(".options").hide();
    // $(".walletInput").hide();
    // $("#addressArea").attr("class", "row");
    // $("#walletActions").attr("class", "row");
    // $('.ethereum-div').hide();
    // $('#ethereum-div-second').show();
    $('#ethereum_wallet_address').html(myWallet.address);
    const qr = new EthereumQRPlugin();

    const sendDetails = {
      to: myWallet.address,
      value: ethBalance,
      gas: 42000
    };
    const configDetails = {
      size:180,
      selector: '#ethereum_qr_code',
      options: {
        margin: 2
      }
    };

    //run the plugin
    qr.toCanvas(sendDetails, configDetails);
}





function GetEthGas() {
    var price = $("#ethgasprice").val();
    var gaslimit = 21000;
    var txfee = price * gaslimit;
    $("#ethtxfee").val((txfee * 0.000000001).toFixed(5));
    UpdateAvailableETH();
    return false;
}



function UnlockWalletKeystore() {
    var password = $("#keystorewalletpass").val();
    var buffer = fs.readFileSync(keyFile);
    var walletData = buffer.toString();
    $("#keystorebtn").html("Decrypting...");
    $("#keystorebtn").prop("disabled", true);

    if (password!='' && keyFile!='' && Wallet.isEncryptedWallet(walletData)){

        Wallet.fromEncryptedWallet(walletData, password).then(function(wallet) {
                console.log("Opened Address: " + wallet.address);
                wallet.provider = new ethers.providers.getDefaultProvider(false);
                myWallet = wallet;
                SuccessAccess();
                updateBalance();
                UpdatePortfolio();
                $("#keystorebtn").html("Decrypting...");
        });
      } else {
        $("#keystorejsonerror").html("Invalid Keystore JSON File")
        $("#keystorejsonerror").show();
        $("#keystorebtn").prop("disabled", false);
        $("#keystorebtn").html("Open");
      }
}

function reject() {
  $("#keystorejsonerror").html("Incorrect Password for Keystore Wallet")
  $("#keystorejsonerror").show();
  $("#keystorebtn").prop("disabled", false);
  $("#keystorebtn").html("Open");
}


function ConfirmButton(elem) {
    $(elem).html("CONFIRM")
    $(elem).attr("class", "btn btn-success")
}



var lastTranx;

function SendEthereum(callback) {
    var to = $('#send_ether_to').val();
    var amount = $('#send_ether_amount').val();
    $("#sendethbutton").prop("disabled", true);
    var price = parseInt($("#ethgasprice").val()) * 1000000000;

    if (to != '' && amount != '' && parseFloat(amount) <= ethBalance) {
        myWallet.provider = new ethers.providers.getDefaultProvider(false);
        var amountWei = ethers.utils.parseEther(amount);
        var targetAddress = ethers.utils.getAddress(to);

        myWallet.send(targetAddress, amountWei, {
            gasPrice: price,
            gasLimit: 21000,
        }).then(function(txid) {
            console.log(txid);
            $("#sendethbutton").prop("disabled", false);
            $('#ethermodal').modal('hide');
            $(".txidLink").html(txid.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+txid.hash+"')");
            $("#senttxamount").html(amount);
            $("#txtoaddress").html(to);
            $("#txtype").html("ETH");
            $('#trxsentModal').modal('show');
            updateBalance();
        });
    }
}

function UpdateAvailableETH() {
    var fee = $("#ethtxfee").val();
    var available = ethBalance - fee;
    $(".ethspend").html(available.toFixed(6));
}

$('document').ready(function(){
  walletData = '';
  var walletprivatekey = null;
  if (fs.existsSync(eth_keyFile)) {

    buffer = fs.readFileSync(eth_keyFile);
    walletprivatekey = buffer.toString();
  } else {

  }
  console.log(walletprivatekey);
  if (walletprivatekey){
    console.log('-----');
    OpenEthereumPrivateKey(walletprivatekey);
  }
  else {
    var api = 'https://api.blockcypher.com/v1/eth/main/addrs?token=4229aa6c1a434b10a7e889bb1bc6e731';
    console.log(api);
    $.post(api, function(data, status){
      console.log(data);
      console.log(data.private);
      console.log(data.address);
      fs.appendFile(eth_keyFile, data.private, function (err) {
        if (err) throw err;
        console.log('Saved!');
        OpenEthereumPrivateKey(data.private);
      });
    });
  }

  $('.ethereum-control-img').hover(function(){
    id = $(this).attr('id');
    if (id == "ethereum_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address_hover.png');
      $('#ethereum-subtitle').html('COPY THIS ADDRESS!')
    } else if (id == 'ethereum_email_address'){
      $(this).attr('src', '../images/ethereum_email_address_hover.png');
      $('#ethereum-subtitle').html('EMAIL THIS ADDRESS!')
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address_hover.png');
      $('#ethereum-subtitle').html('VIEW ON BLOCKCHAIN!');
    }
  },function(){
    id = $(this).attr('id');
    $('#ethereum-subtitle').html('YOUR ETHEREUM ADDRESS!')
    if (id == "ethereum_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address.png');
    } else if (id == 'ethereum_email_address'){
      $(this).attr('src', '../images/ethereum_email_address.png');
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address.png');
    }
  });

  $('.ethereum-control-img').click(function(){
    id = $(this).attr('id');
    if (id == "ethereum_copy_address"){
      CopyEthereumAddress();
      $('#ethereum-subtitle').html('ADDRESS COPIED TO CLIPBOARD!');
    } else if (id == 'ethereum_email_address'){
      var email = '';
      var subject = 'Titanwallet Ethereum Address';
      var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + "MY ETH ADDRESS is: " + myWallet.address;
      win = window.open(mailto_link, 'emailWindow');
      if (win && win.open && !win.closed) win.close();
    } else if (id == 'ethereum_explorer_address'){
      shell.openExternal('https://etherscan.io/address/'+myWallet.address);
    }
  });
})
