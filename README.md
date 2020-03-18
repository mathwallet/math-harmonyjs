# math-harmony

### Compile

```
npm run install
npm run webpack
```

### Harmony Web3 API
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
	 * Forget Identity
	 * @return account {"address":"one1...","name":"cc1"}
	 */
	async forgetIdentity() {
		// sign out
		const success = await window.harmony.forgetIdentity();
		return success;
	}
	/***
	 * Transfer
	 * @param from from(bech32)
	 * @param to to(bech32)
	 * @param amount amount
	 * @return hash
	 */
	async transfer(from, to, amount) {
		const rpcUrl = "http://s0.b.hmny.io:9500";
		// Harmony config
		const config = {
			chainType: ChainType.Harmony,
			chainUrl: rpcUrl
		};
		// Blockchain
		const harmony = new Harmony(rpcUrl, config);
		
		// Shards
		const shardsResponse = await harmony.blockchain.getShardingStructure();
		const shards = shardsResponse.result;
		// result = [
		//	    {
		//	      shardID: 0,
		//	      http: 'http://localhost:9500',
		//	      ws: 'ws://localhost:9800',
		//	    },
		//	    {
		//	      shardID: 1,
		//	      http: 'http://localhost:9501',
		//	      ws: 'ws://localhost:9801',
		//	    },
		//	 ];
		
		// use first shard
		const useShard = shards[0];
		
		// Transaction
		const txnObject = {
			`${from}_${useShard.shardID}`,
			`${to}_${useShard.shardID}`,
			value: new harmony.utils.Unit(amount).asEther().toWei(),
			gasLimit: '210000',
			gasPrice: new harmony.utils.Unit('100').asGwei().toWei(),
		};

		const txn = harmony.transactions.newTx(txnObject,true);
		const signed = await window.harmony.signTransaction(txn);
		return signed.sendTransaction();
	}
``` 
### Test

Download MathWallet Extesion

https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/extension/mathwalletplus-v2.0.4.zip

