var Datastore = require('nedb');
var bip39 = require('bip39');
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}
var bitcoin = require('bitcoinjs-lib');

var Hasher = [];
Hasher.Salt = 'titan-wallet';
Hasher.Algorithm = 'sha512';
Hasher.Encryption = 'aes-256-cbc';
Hasher.Encoding = {
    In: 'utf8',
    Out: 'hex'
};

var BITCOIN_CONSTANTS = {
    Bitcoin: {
        Decimals: 8,
        Satoshis: 100000000,
        Networks: {
            Testnet: 'testnet',
            Bitcoin: 'bitcoin',
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

function encrypt(key, password) {
    const cipher = crypto.createCipher(Hasher.Encryption, password);
    return cipher.update(key, Hasher.Encoding.In, Hasher.Encoding.Out) + cipher.final(Hasher.Encoding.Out);
}

function decrypt(key, password) {
    const cipher = crypto.createDecipher(Hasher.Encryption, password);
    return cipher.update(key, Hasher.Encoding.Out, Hasher.Encoding.In) + cipher.final(Hasher.Encoding.In);
}
var utxos = null;
function updateWallet(address){
  var c_blockexplorer = require('blockchain.info/blockexplorer');
  var c_exchange = require('blockchain.info/exchange');

  c_blockexplorer.getUnspentOutputs(address).then((result) => {
    utxos = result.unspent_outputs;
    coins = result.unspent_outputs.reduce((a, c) => a + c.value, 0) / BITCOIN_CONSTANTS.Bitcoin.Satoshis;
    console.log('coins', coins);
    c_exchange.getTicker({ currency: 'USD' }).then( (r) => {
      $total_usd = coins * r.sell;
      $('#bitcoin_balance_usd').html($total_usd.toFixed(2));
    });

    $('#bitcoin_balance').html(coins.toFixed(8));
    $('#bitcoin_qr_code').html('');
    $('#bitcoin_qr_code').qrcode({width: 180,height: 180, text: address});

  },(e) => {
      if (e.toString() === BITCOIN_CONSTANTS.ReturnValues.NoFreeOutputs) {
          $('#bitcoin_balance').html('0.00');
          $('#bitcoin_qr_code').html('');
          $('#bitcoin_qr_code').qrcode({width: 180,height: 180, text: address});
          console.log('error');
      }
  });

  c_blockexplorer.getLatestBlock()
      .then(block => c_blockexplorer.getBlock(block.hash))
      .then((block) => {
        console.log('block', block);
        // Fee Normal for a single transaction (450 bytes)
        txNormalFeeKB = 450;
        txfeeperbyte = block.fee / block.size;
        fee = txNormalFeeKB * txfeeperbyte / BITCOIN_CONSTANTS.Bitcoin.Satoshis;
        $('#btctxfee').val(fee.toFixed(8));
      });
}
var bitcoin_mywif  = null;
var BTCWallet = [];

BTCWallet.Defaults = {
    Encryption: 'aes-256-cbc',
    Path: "m/44'/0'/0'/0/0",
    DBFileName: 'bitcoin',
};

BTCWallet.Events = {
  Updated: 'updated',
};

$('document').ready(function(){


  db = new Datastore({ filename: `./bitcoin.db`, autoload: true });

  db.find({'network':'bitcoin'}, (err, docs) => {
      if (err || docs.length == 0){
        console.log(err);
        console.log(docs);
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeed(mnemonic);
        const master = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.bitcoin);
        console.log('wallet', BTCWallet);
        const derived = master.derivePath(BTCWallet.Defaults.Path);
        const address = derived.getAddress();
        wif = derived.keyPair.toWIF();
        network = 'bitcoin';
        console.log(crypto);
        var crypt = require('crypto');
        const cipher = crypt.createCipher(BTCWallet.Defaults.Encryption, 'titan');
        wif = cipher.update(wif, 'utf8', 'hex') + cipher.final('hex');
        bitcoin_mywif = wif;
        const obj = {
            name: 'bitcoin',
            address: address,
            wif: wif,
            network: network,
        };
        db.insert(obj);
        $('#bitcoin_wallet_address').html(address);
        updateWallet(address);
        setInterval(updateWallet(address), 5000);
      } else {
        console.log('bitcoin address', docs[0].address);
        $('#bitcoin_wallet_address').html(docs[0].address);
        bitcoin_mywif = docs[0].wif;
        updateWallet(docs[0].address);
        setInterval(updateWallet(docs[0].address), 5000);
      }
  });



  $('.bitcoin-control-img').hover(function(){
    id = $(this).attr('id');
    if (id == "bitcoin_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address_hover.png');
      $('#bitcoin-subtitle').html('COPY THIS ADDRESS!')
    } else if (id == 'bitcoin_email_address'){
      $(this).attr('src', '../images/ethereum_email_address_hover.png');
      $('#bitcoin-subtitle').html('EMAIL THIS ADDRESS!')
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address_hover.png');
      $('#bitcoin-subtitle').html('VIEW ON BLOCKCHAIN!');
    }
  },function(){
    id = $(this).attr('id');
    $('#bitcoin-subtitle').html('YOUR BITCOIN ADDRESS!')
    if (id == "bitcoin_copy_address"){
      $(this).attr('src', '../images/ethereum_copy_address.png');
    } else if (id == 'bitcoin_email_address'){
      $(this).attr('src', '../images/ethereum_email_address.png');
    } else {
      $(this).attr('src', '../images/ethereum_explorer_address.png');
    }
  });

  $('.bitcoin-control-img').click(function(){
    id = $(this).attr('id');
    address = $('#bitcoin_wallet_address').html();
    if (id == "bitcoin_copy_address"){
      CopyBitcoinAddress();
      $('#bitcoin-subtitle').html('ADDRESS COPIED TO CLIPBOARD!');
    } else if (id == 'bitcoin_email_address'){
      var email = '';
      var subject = 'Titanwallet BitCoin Address';
      var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + "MY BITCOIN ADDRESS is: " + address;
      win = window.open(mailto_link, 'emailWindow');
      if (win && win.open && !win.closed) win.close();
    } else if (id == 'bitcoin_explorer_address'){
      shell.openExternal('https://blockchain.info/address'+address);
    }
  });
})

function CopyBitcoinAddress() {
    address = $('#bitcoin_wallet_address').html();
    clipboardy.writeSync(address);
}


function SendBitcoin(){
      btc = $('#send_bitcoin_amount').val();
      to_address = $('#send_bitcoin_to').val();
      fee = $('#btctxfee').val();
      fee = fee * BITCOIN_CONSTANTS.Bitcoin.Satoshis;
      address = $('#bitcoin_wallet_address').html();
      const satoshis = Math.round(btc * BITCOIN_CONSTANTS.Bitcoin.Satoshis);

      const network = 'bitcoin';
      var bitcoin = require('bitcoinjs-lib');
      var txb = new bitcoin.TransactionBuilder(bitcoin.networks.bitcoin);

      let current = 0;
      for (const utx of utxos) {

          txb.addInput(utx.tx_hash_big_endian, utx.tx_output_n);

          current += utx.value;
          if (current >= (satoshis + fee)) break;
      }

      console.log('bitcoin', to_address, satoshis);
      txb.addOutput(to_address, satoshis);

      const change = current - (satoshis + fee);
      if (change) txb.addOutput(address, change);


      const wif = readDecrypted(bitcoin_mywif);
      console.log('wif', wif);
      const key = bitcoin.ECPair.fromWIF(wif);

      txb.sign(0, key);

      const raw = txb.build().toHex();
      pushtx = require('blockchain.info/pushtx');
      c_pushtx = pushtx.pushtx;
      $('.modal').modal('hide');
      return c_pushtx(raw).then(result => {result === BITCOIN_CONSTANTS.ReturnValues.TransactionSubmitted; console.log(result);});
}

function readDecrypted(wif) {
    var crypto = require('crypto');
    const cipher = crypto.createDecipher(BTCWallet.Defaults.Encryption, 'titan');
    return cipher.update(wif, 'hex', 'utf8') + cipher.final('utf8');
}

function CheckBitCoinAvailable(val){
  console.log(val);
  fee = $('#btctxfee').val();
  balance = $('#bitcoin_balance').html();
  total_amount = parseFloat(fee) + parseFloat(val);
  console.log('balance', balance);
  console.log('total_amount', total_amount);
  if (parseFloat(total_amount) < parseFloat(balance)) {
    $('#sendbtcbutton').prop('disabled', false);
  } else {
    $('#sendbtcbutton').prop('disabled', true);
  }
}
