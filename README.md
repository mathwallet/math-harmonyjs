# math-harmony

### Compile

```
npm run install
npm run webpack
```

### Harmony Web3 API
```javascript
	// Current harmony network information
	// network = { chain_url, net_version }
	 const network = window.harmony.network; 
```
```javascript
        /***
	 * login
	 * @return account {"address":"one1...","name":"cc1"}
	 */
	async login() {
		if (!window.harmony) {
			throw new Error("Please install the MathWallet first");
		}
		// Account
		const account = await window.harmony.getAccount();
		// Use address
		const { address, name } = account;

		return account;
	}
	/***
	 * Transfer
	 * @param from from
	 * @param to to
	 * @param amount amount
	 * @return hash
	 */
	async transfer(from, to, amount) {
		const rpcUrl = "http://54.201.38.205:9500";
		// Harmony config
		const config = {
			chainType: ChainType.Harmony,
			chainUrl: rpcUrl
		};
		// Blockchain
		const harmony = new Harmony(rpcUrl, config);
		const txnObject = {
			from,
			to,
			value: new harmony.utils.Unit(amount).asEther().toWei(),
			gasLimit: '210000',
			gasPrice: new harmony.utils.Unit('100').asGwei().toWei(),
		};

		const txn = harmony.transactions.newTx(txnObject);
		const signed = await window.harmony.signTransaction(txn);
		return signed.sendTransaction();
	}
``` 
### Test

Download MathWallet Extesion

https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/extension/mathwalletplus-v2.0.2.zip

