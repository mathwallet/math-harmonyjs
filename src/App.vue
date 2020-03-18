<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <template v-if="sender">
          <v-card class="mx-auto" max-width="400">
            <v-card-title>{{balance}} ONE</v-card-title>
            <v-card-subtitle class="pb-0">{{sender?sender.bech32Address:""}}</v-card-subtitle>
            <v-card-text>staking</v-card-text>
            <v-card-actions>
              <v-btn color="orange" @click="transfer" text>Trasfer</v-btn>
              <v-btn color="blue" @click="createDelegateTransaction" text>Stake</v-btn>
              <v-btn color="blue" @click="createUndelegateTransaction" text>Unstake</v-btn>
            </v-card-actions>
          </v-card>
        </template>
        <template v-else>
          <v-btn color="blue" @click="login">Login</v-btn>
        </template>
        <v-snackbar v-model="snackbar">
          {{ snackbarMessage }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Vue from "vue";
import { Harmony, HarmonyExtension } from "@harmony-js/core";
import { HarmonyAddress } from "@harmony-js/crypto";
import { StakingFactory } from "@harmony-js/staking";
import {
  ChainID,
  ChainType,
  hexToNumber,
  DefaultBlockParams,
  Unit
} from "@harmony-js/utils";

const URL_OPENSTAKING = `https://api.s0.os.hmny.io`;
const harmony = new Harmony(URL_OPENSTAKING, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyPangaea
});
export default {
  name: "App",
  data: () => ({
    sender: null,
    balance: "0",
    snackbar: false,
    snackbarMessage: ""
  }),
  mounted() {
    // Sharding
    harmony.blockchain.getShardingStructure().then(res => {
      harmony.shardingStructures(res.result);
      // 获取账户
      this.login();
    });
  },
  methods: {
    login() {
      if (window.harmony) {
        window.harmony.getAccount().then(account => {
          this.sender = new HarmonyAddress(account.address);
          // 刷新余额
          this.getBalance();
          // 定时刷新数据
          setInterval(() => {
            this.getBalance();
          }, 5000);
        });
      }
    },
    getBalance() {
      harmony.blockchain
        .getBalance({
          address: this.sender.checksum,
          blockNumber: DefaultBlockParams.latest,
          shardID: 0
        })
        .then(response => {
          this.balance = Unit.Wei(hexToNumber(response.result)).toOne();
        });
    },
    getStakingInfo() {
      const api =
        "https://staking-explorer2-268108.appspot.com/networks/harmony-open-staking/delegations/";
      Vue.axios.get(api + this.sender.basicHex).then(response => {
        console.log(response.data);
      });
    },
    transfer() {
      const receiver = "one17zwaeqxp2zq35qtw2cq74ke2v7sxjn2s3aky67";
      const txn = harmony.transactions.newTx({
        from: this.sender.checksum,
        //  token send to
        to: new HarmonyAddress(receiver).checksum,
        // amount to send
        value: Unit.One("1").toWei(),
        shardID: 0,
        toShardID: 0,
        // gas limit, you can use string
        gasLimit: "210000",
        // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
        gasPrice: Unit.Gwei("10").toWei()
      });
      window.harmony.signTransaction(txn).then(signedTxn => {
        signedTxn.sendTransaction().then(([sentTxn, txnHash]) => {
          console.log("Hash->", txnHash);
          this.snackbar = true;
          this.snackbarMessage = "Success";
        });
      });
    },
    createDelegateTransaction() {
      const delegatorAddress = this.sender.checksum;
      const validatorAddress = new HarmonyAddress(
        "one1ekup98s5tqxtr5hdzsz664cfy579jpq6w5smrr"
      ).checksum;
      const stakingTxn = new StakingFactory(harmony.messenger)
        .delegate({
          delegatorAddress,
          validatorAddress,
          amount: Unit.One("1").toHex()
        })
        .setTxParams({
          gasPrice: Unit.Gwei("5").toHex(),
          gasLimit: Unit.Wei("600000").toHex(),
          chainId: harmony.chainId
        })
        .build();
      stakingTxn.setFromAddress(this.sender.checksum);

      window.harmony.signTransaction(stakingTxn).then(signedTxn => {
        signedTxn.sendTransaction().then(([sentTxn, txnHash]) => {
          console.log("Hash->", txnHash);
        });
      });
    },
    createUndelegateTransaction() {
      const delegatorAddress = this.sender.checksum;
      const validatorAddress = new HarmonyAddress(
        "one1ekup98s5tqxtr5hdzsz664cfy579jpq6w5smrr"
      ).checksum;
      const stakingTxn = new StakingFactory(harmony.messenger)
        .undelegate({
          delegatorAddress,
          validatorAddress,
          amount: Unit.One("1").toHex()
        })
        .setTxParams({
          gasPrice: Unit.Gwei("5").toHex(),
          gasLimit: Unit.Wei("600000").toHex(),
          chainId: harmony.chainId
        })
        .build();
      stakingTxn.setFromAddress(this.sender.checksum);

      window.harmony.signTransaction(stakingTxn).then(signedTxn => {
        signedTxn.sendTransaction().then(([sentTxn, txnHash]) => {
          console.log("Hash->", txnHash);
        });
      });
    }
  }
};
</script>
