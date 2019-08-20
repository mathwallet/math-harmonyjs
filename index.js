
import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType, hexToNumber } from '@harmony-js/utils';
import { fromBech32 } from '@harmony-js/crypto';

// Samples
class HarmonySample {
	/***
	 * login
	 * @return account {"address":"one1wus0h29gmf48wzyxze6g85fh82l4a7s4fu3y9q","name":"cc1"}

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
		console.log(JSON.stringify(signed));

		return signed.sendTransaction();
	}


	/***
	 * Get Balance
	 * @param bech32Address address
	 * @return balance
	 */
	async balance(bech32Address) {
		const rpcUrl = "http://54.201.38.205:9500";
		// Harmony config
		const config = {
			chainType: ChainType.Harmony,
			chainUrl: rpcUrl
		};
		// Address prase
		const hexAddress = fromBech32(bech32Address, "one");

		// Blockchain
		const harmony = new Harmony(rpcUrl, config);
		const balance = await harmony.blockchain.getBalance({ address: hexAddress });

		return hexToNumber(balance.result);

	}
}

window.HarmonySample = new HarmonySample();