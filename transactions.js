const Web3 = require('web3');
const Common = require('@ethereumjs/common').default;
const { Transaction } = require('@ethereumjs/tx');

(async () => {
    // Set up or Config
    const url = "http://127.0.0.1:7545";
    const web3 = new Web3(url);
    
    // utility
    const ascii_2_0xhex = (num) => {
        return "0x" + num.toString(16)
    }

    // Set the sending and receiving addresses for the transactions
    const sendingAddress = "0xe482B89f89191Ea9a464ecB360910C50Fbf69307";
    const receivingAddress = "0xe74505A3B67f0F2A04683Ea725Aa94DE66C9Bb8e";

    // Check the balances of each address
    const sendingBalances = await web3.eth.getBalance(sendingAddress, (error, result) => { return !error ? result : error });
    console.log(`Sending Balances: ${sendingBalances}`);

    const receivingBalances = await web3.eth.getBalance(receivingAddress, (error, result) => { return !error ? result : error });
    console.log(`Receiving Balances: ${receivingBalances}`);

    // Setup Transaction variables
    const common = new Common({chain: 'mainnet'});

    let rawTransactions = {
        nonce: ascii_2_0xhex(0),
        to: receivingAddress,
        gasPrice: ascii_2_0xhex(20000000),
        gasLimit: ascii_2_0xhex(3000000),
        value: ascii_2_0xhex(1),
        data: "0x00"
    }

    // Sign Transactions
    const privateKeySender = "2ecc0207aba0d2e6a2869d202318d30b2328f5ae95fa35469f52e2616569b54c";
    const privateKeySenderHex = Buffer.from(privateKeySender, 'hex');

    // const transaction = new EthereumTransaction(rawTransactions);
    // transaction.sign(privateKeySenderHex);
    const tx = Transaction.fromTxData(rawTransactions, { common });
    const signedTx = tx.sign(privateKeySenderHex);
    
    // Send the serialized signed transaction to Ethereum Network
    // const serializedTransaction = transaction.serialize();
    const serializedTx = signedTx.serialize();
    web3.eth.sendSignedTransaction(serializedTx);

    // Check balances after transactions
    const currentSendingBalances = await web3.eth.getBalance(sendingAddress, (error, result) => { return !error ? result : error });
    console.log(`Sending Balances: ${currentSendingBalances}`);

    const currentReceivingBalances = await web3.eth.getBalance(receivingAddress, (error, result) => { return !error ? result : error });
    console.log(`Receiving Balances: ${currentReceivingBalances}`);
})();