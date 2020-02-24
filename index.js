
import { HarmonyExtension } from '@harmony-js/core';
import { ChainID, ChainType, hexToNumber, Unit } from '@harmony-js/utils';
import { fromBech32 } from '@harmony-js/crypto';

// Harmony config
const config = {
	chainType: ChainType.Harmony,
	chainUrl:"https://api.s0.t.hmny.io",
	chainId:ChainID.EthMainnet
};

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
		const harmonyExt = new HarmonyExtension(window.harmony, config);
		// Account
		const account = await harmonyExt.wallet.getAccount();
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
		const harmonyExt = new HarmonyExtension(window.harmony, config);

		const fromShard = 0;
		const toShard = 0;
		const txnObject = {
			from:from + "-" + fromShard,
			to:to + "-" + toShard,
			value: Unit.Ether(amount).toWei(),
			gasLimit: Unit.Wei('21000').toWeiString(),
			gasPrice: Unit.Gwei('2').toWeiString()
		};
		const txn = harmonyExt.transactions.newTx(txnObject,true);
		const signed = await harmonyExt.wallet.signTransaction(txn);
		return signed.sendTransaction();

	}


	/***
	 * Get Balance
	 * @param bech32Address address
	 * @return balance
	 */
	async balance(bech32Address) {
		// Address prase
		const hexAddress = fromBech32(bech32Address);

		// Blockchain
		const harmony = new Harmony(rpcUrl, config);
		const balance = await harmony.blockchain.getBalance({ address: hexAddress });

		return hexToNumber(balance.result);

	}
}

window.HarmonySample = new HarmonySample();