var Datastore = require('nedb');
var bip39 = require('bip39');
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}
var litecoin = require('bitcoinjs-lib');

var Hasher = [];
Hasher.Salt = 'titan-wallet';
Hasher.Algorithm = 'sha512';
Hasher.Encryption = 'aes-256-cbc';
Hasher.Encoding = {
    In: 'utf8',
    Out: 'hex'
};

var LITECOIN_CONSTANTS = {
    Litecoin: {
        Decimals: 8,
        Satoshis: 100000000,
        Networks: {
            Testnet: 'testnet',
            Bitcoin: 'bitcoin',
            Litecoin: 'litecoin',
        }
    },
    ReturnValues: {
        TransactionSubmitted: 'Transaction Submitted',
        NoFreeOutputs: 'No free outputs to spend',
        Fragments: {
            MinimumFeeNotMet: 'min relay fee not met',
        },
    },
    Messages: {
        Wallet: {
            Created: 'Your wallet has been created and saved!',
            Mnemonic: 'Store this sequence safely',
            Failed: 'A wallet could not be created at this moment',
        },
        Transactions: {
            NOTSent: 'Transaction could not be sent',
            Sent: 'Your transaction was sent'
        },
        Errors: {
            FeeNotMet: 'A fee to process this transaction was not provided'
        }
    }
};


function hash(password) {

    return new Promise((resolve, reject) => {

        if (!password) reject('No value provided');

        crypto.pbkdf2(password, "titan", 2048, 48, Hasher.Algorithm, (err, data) => {
            if (err) reject(err);

            const hex = data.toString('hex');
            resolve(hex);

        });
    });
}

var utxos = null;
var ltcUSD = 0;
function updateLTCWallet(address){
  console.log('updateltcwallet', address);
  $.get('https://api.blockcypher.com/v1/ltc/main/addrs/'+address+'/balance') .then(function(data) {
    console.log('litecoin balance', data.final_balance);
    ltc_balance = data.balance / LITECOIN_CONSTANTS.Litecoin.Satoshis;
    $('#litecoin_balance').html(ltc_balance.toFixed(8));
    $('#litecoin_qr_code').html('');
    $('#litecoin_qr_code').qrcode({width: 180,height: 180, text: address});

    var api = "https://api.coinmarketcap.com/v1/ticker/litecoin/";
    $.get(api, function(data, status){
      ltcUSD = parseFloat(data[0]['price_usd']);
      $total_usd =ltc_balance * ltcUSD;
      $('#litecoin_balance_usd').html($total_usd.toFixed(2));
    });
  });

  $.get('https://api.blockcypher.com/v1/btc/main').then(function(data) {
    lastest_url = data.latest_url;
    console.log('lastest_url', lastest_url);
    $.get(lastest_url).then(function(blockdata) {
      txNormalFeeKB = 450;
      console.log(blockdata);
      console.log('block', blockdata.fees, blockdata.size);
      txfeeperbyte = blockdata.fees / blockdata.size;
      fee = txNormalFeeKB * txfeeperbyte * 5 / LITECOIN_CONSTANTS.Litecoin.Satoshis;
      $('#ltctxfee').val(fee.toFixed(8));
    });
  });
}
var litecoin_mywif  = null;
var LTCWallet = [];

LTCWallet.Defaults = {
    Encryption: 'aes-256-cbc',
    Path: "m/44'/0'/0'/0/0",
    DBFileName: 'litecoin',
};

LTCWallet.Events = {
  Updated: 'updated',
};
var address_lite = 0;
$('document').ready(function(){
  db_litecoin = new Datastore({ filename: `./litecoin.db`, autoload: true });
  db_litecoin.find({'network':'litecoin'}, (err, docs) => {
      if (err || docs.length == 0){
        console.log(err);
        console.log(docs);
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeed(mnemonic);
        const master = litecoin.HDNode.fromSeedBuffer(seed, litecoin.networks.litecoin);
        console.log('wallet', LTCWallet);
        const derived = master.derivePath(LTCWallet.Defaults.Path);
        address_lite = derived.getAddress();
        wif = derived.keyPair.toWIF();
        network = 'litecoin';
        console.log(crypto);
        var crypt = require('crypto');
        const cipher = crypt.createCipher(LTCWallet.Defaults.Encryption, 'titan');
        wif = cipher.update(wif, 'utf8', 'hex') + cipher.final('hex');
        litecoin_mywif = wif;
        const obj = {
            name: 'litecoin',
            address: address_lite,
            wif: wif,
            network: network,
        };
        db_litecoin.insert(obj);
        $('#litecoin_wallet_address').html(address_lite);
        updateLTCWallet(address_lite);
        setInterval(updateLTCWallet(address_lite), 3000);
      } else {
        console.log('litecoin address', docs[0].address);
        $('#litecoin_wallet_address').html(docs[0].address);
        litecoin_mywif = docs[0].wif;
        address_lite = docs[0].address;
        updateLTCWallet(address_lite);
        setInterval(updateLTCWallet(address_lite), 3000);
      }
  });



  $('.litecoin-control-img').hover(function(){
    id = $(this).attr('id');
    if (id == "litecoin_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address_hover.png');
      $('#litecoin-subtitle').html('COPY THIS ADDRESS!')
    } else if (id == 'litecoin_email_address'){
      $(this).attr('src', '../images/ethereum_email_address_hover.png');
      $('#litecoin-subtitle').html('EMAIL THIS ADDRESS!')
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address_hover.png');
      $('#litecoin-subtitle').html('VIEW ON BLOCKCHAIN!');
    }
  },function(){
    id = $(this).attr('id');
    $('#litecoin-subtitle').html('YOUR LITECOIN ADDRESS!')
    if (id == "litecoin_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address.png');
    } else if (id == 'litecoin_email_address'){
      $(this).attr('src', '../images/ethereum_email_address.png');
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address.png');
    }
  });

  $('.litecoin-control-img').click(function(){
    id = $(this).attr('id');
    address = $('#litecoin_wallet_address').html();
    if (id == "litecoin_copy_address"){
      CopyLitecoinAddress();
      $('#litecoin-subtitle').html('ADDRESS COPIED TO CLIPBOARD!');
    } else if (id == 'litecoin_email_address'){
      var email = '';
      var subject = 'Titanwallet Litecoin Address';
      var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + "MY LITECOIN ADDRESS is: " + address;
      win = window.open(mailto_link, 'emailWindow');
      if (win && win.open && !win.closed) win.close();
    } else if (id == 'litecoin_explorer_address'){
      shell.openExternal('https://blockchain.info/address'+address);
    }
  });
})

function CopyLitecoinAddress() {
    address = $('#litecoin_wallet_address').html();
    clipboardy.writeSync(address);
}

var request = require("request");

//manually hit an insight api to retrieve utxos of address
function getUTXOs(address) {
  return new Promise((resolve, reject) => {
    request({
      uri: 'https://insight.litecore.io/api/addr/' + address + '/utxo',
      json: true
    },
      (error, response, body) => {
        if(error) reject(error);
        resolve(body)
      }
    )
  })
}

//manually hit an insight api to broadcast your tx
function broadcastTX(rawtx) {
  return new Promise((resolve, reject) => {
    request({
      uri: 'https://insight.litecore.io/api/tx/send',
      method: 'POST',
      json: {
        rawtx
      }
    },
      (error, response, body) => {
        console.log('broadcastTX error', error);
        if(error) reject(error);
        console.log('body', body);
        console.log('body', response);
        resolve(body.txid)
      }
    )
  })
}

function SendLitecoin(){
      ltc = $('#send_litecoin_amount').val();
      to_address = $('#send_litecoin_to').val();
      fee = $('#ltctxfee').val();
      var fee = fee * LITECOIN_CONSTANTS.Litecoin.Satoshis;
      var address = $('#litecoin_wallet_address').html();
      const satoshis = Math.round(ltc * LITECOIN_CONSTANTS.Litecoin.Satoshis);

      const network = 'litecoin';
      var Litecoin = require("litecore-lib");
      getUTXOs(address)
        .then((utxos) => {

          let current = 0;
          for (var i = 0; i < utxos.length; i++) {
            current +=utxos[i]['satoshis'];
            if (current >= (satoshis + fee)) break;
          } //add up the balance in satoshi format from all utxos

          const wif = readDecrypted(litecoin_mywif);
          console.log('wif', wif);
          key = Litecoin.PrivateKey.fromWIF(wif);
          console.log(utxos);
          console.log(to_address, address);
          console.log(satoshis, fee);

          var tx = new Litecoin.Transaction() //use litecore-lib to create a transaction
            .from(utxos)
            .to(to_address, satoshis)
            .fee(fee)
            .change(address)
            .sign(key)
            .serialize();
          console.log('tx', tx);
          return broadcastTX(tx); //broadcast the serialized tx
        })
        .then((result) => {
          $('.modal').modal('hide');
          updateLTCWallet(address);
          console.log(result); // txid
        })
        .catch((error) => {
          throw error;
      });
}

// function SendLitecoin(){
//       ltc = $('#send_litecoin_amount').val();
//       to_address = $('#send_litecoin_to').val();
//       fee = $('#ltctxfee').val();
//       fee = fee * LITECOIN_CONSTANTS.Litecoin.Satoshis;
//       address = $('#litecoin_wallet_address').html();
//       const satoshis = Math.round(ltc * LITECOIN_CONSTANTS.Litecoin.Satoshis);
//
//       const network = 'litecoin';
//       var litecoin = require('bitcoinjs-lib');
//       var txb = new litecoin.TransactionBuilder(litecoin.networks.litecoin);
//       getUTXOs(address).then((utxos) => {
//         console.log('lite utxos', utxos);
//       });
//       let current = 0;
//       for (const utx of utxos) {
//
//           txb.addInput(utx.tx_hash_big_endian, utx.tx_output_n);
//
//           current += utx.value;
//           if (current >= (satoshis + fee)) break;
//       }
//
//       console.log('litecoin', to_address, satoshis);
//       txb.addOutput(to_address, satoshis);
//
//       const change = current - (satoshis + fee);
//       if (change) txb.addOutput(address, change);
//
//
//       const wif = readDecrypted(litecoin_mywif);
//       console.log('wif', wif);
//       const key = litecoin.ECPair.fromWIF(wif);
//
//       txb.sign(0, key);
//
//       const raw = txb.build().toHex();
//       pushtx = require('blockchain.info/pushtx');
//       c_pushtx = pushtx.pushtx;
//       $('.modal').modal('hide');
//       return c_pushtx(raw).then(result => {result === LITECOIN_CONSTANTS.ReturnValues.TransactionSubmitted; console.log(result);});
// }

function readDecrypted(wif) {
    var crypto = require('crypto');
    const cipher = crypto.createDecipher(LTCWallet.Defaults.Encryption, 'titan');
    return cipher.update(wif, 'hex', 'utf8') + cipher.final('utf8');
}

function CheckLitecoinAvailable(val){
  console.log(val);
  fee = $('#ltctxfee').val();
  balance = $('#litecoin_balance').html();
  total_amount = parseFloat(fee) + parseFloat(val);
  console.log('balance', balance);
  console.log('total_amount', total_amount);
  if (parseFloat(total_amount) < parseFloat(balance)) {
    $('#sendltcbutton').prop('disabled', false);
  } else {
    $('#sendltcbutton').prop('disabled', true);
  }
}
