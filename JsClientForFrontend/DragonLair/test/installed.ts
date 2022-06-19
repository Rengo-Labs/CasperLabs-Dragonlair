import { config } from "dotenv";
config();
import { DRAGONLAIRClient ,utils} from "../src";
import { getDeploy } from "./utils";

import {
  CLValueBuilder,
  Keys,
  CLPublicKey,
  CLAccountHash,
  CLPublicKeyType,
  Contracts,
  CLByteArray
} from "casper-js-sdk";

const {
  NODE_ADDRESS,
  EVENT_STREAM_ADDRESS,
  CHAIN_NAME,
  DRAGONLAIR_MASTER_KEY_PAIR_PATH,
  MINT_PAYMENT_AMOUNT,
  MINT_AMOUNT,
  BURN_PAYMENT_AMOUNT,
  BURN_AMOUNT,
  APPROVE_PAYMENT_AMOUNT,
  APPROVE_AMOUNT,
  TRANSFER_PAYMENT_AMOUNT,
  TRANSFER_AMOUNT,
  TRANSFER_FROM_PAYMENT_AMOUNT,
  TRANSFER_FROM_AMOUNT,
  DRAGONLAIR_CONTRACT,
  PAIR_CONTRACT,
  PACKAGE_HASH,
  MASTER_KEY_PAIR_PATH,
  DRAGONLAIR_FUNCTIONS_PAYMENT_AMOUNT,
  ALLOWANCES_AMOUNT,
  DRAGONLAIR_CONTRACT_PACKAGE,
  SNOWL_CONTRACT
} = process.env;


const KEYS = Keys.Ed25519.parseKeyFiles(
  `${DRAGONLAIR_MASTER_KEY_PAIR_PATH}/public_key.pem`,
  `${DRAGONLAIR_MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

function splitdata(data:string)
{
    var temp=data.split('(');
    var result=temp[1].split(')');
    return result[0];
}

const dragonlair = new DRAGONLAIRClient(
  NODE_ADDRESS!,
  CHAIN_NAME!,
  EVENT_STREAM_ADDRESS!
);

const test = async () => {

  await dragonlair.setContractHash(DRAGONLAIR_CONTRACT!);

  //name
  const name = await dragonlair.name();
  console.log(`... Contract name: ${name}`);

  //symbol
  const symbol = await dragonlair.symbol();
  console.log(`... Contract symbol: ${symbol}`);

  //decimal
  const decimal = await dragonlair.decimal();
  console.log(`... Contract decimal: ${decimal}`);

  // //totalsupply
  let totalSupply = await dragonlair.totalSupply();
  console.log(`... Total supply : ${totalSupply}`);

  // // //balanceof user
  let userbalance = await dragonlair.balanceOf("24a56544c522eca7fba93fb7a6cef83e086706fd87b2f344f5c3dad3603d11f1");
  console.log(`... User Balance : ${userbalance}`);


  // //nonce
  // // let nonce = await dragonlair.nonce(KEYS.publicKey);
  // // console.log(`... Nonce: ${nonce}`);

  // //allowance
  // let allowance = await dragonlair.allowance("53d18dd2aebf2a29bb8e9c7643c5cd022469a5d5a1139c5e7e2f12bc3070e361","53d18dd2aebf2a29bb8e9c7643c5cd022469a5d5a1139c5e7e2f12bc3070e361");
  // console.log(`... Allowance: ${allowance}`);
 
  // //mint
  // const mintDeployHash = await dragonlair.mint(
  //   KEYS,
  //   KEYS.publicKey,
  //   MINT_AMOUNT!,
  //   MINT_PAYMENT_AMOUNT!
  // );
  // console.log("... Mint deploy hash: ", mintDeployHash);

  // await getDeploy(NODE_ADDRESS!, mintDeployHash);
  // console.log("... Token minted successfully.");


  // //burn
  // const burnDeployHash = await dragonlair.burn(
  //   KEYS,
  //   KEYS.publicKey,
  //   BURN_AMOUNT!,
  //   BURN_PAYMENT_AMOUNT!
  // );
  // console.log("... Burn deploy hash: ", burnDeployHash);

  // await getDeploy(NODE_ADDRESS!, burnDeployHash);
  // console.log("... Token burned successfully");

  // //approve
  // const approveDeployHash = await dragonlair.approve(
  //   KEYS,
  //   KEYS.publicKey,
  //   "10000000000",
  //   APPROVE_PAYMENT_AMOUNT!
  // );
  // console.log("... Approve deploy hash: ", approveDeployHash);

  // await getDeploy(NODE_ADDRESS!, approveDeployHash);
  // console.log("... Token approved successfully");

  //increaseallowance
  // const increaseAllowanceJsClientDeployHash = await dragonlair.increaseAllowanceJsClient(
  //   KEYS,
  //   KEYS.publicKey,
  //   ALLOWANCES_AMOUNT!,
  //   TRANSFER_PAYMENT_AMOUNT!
  // );
  // console.log("...IncreaseAllowance JsClient deploy hash: ",increaseAllowanceJsClientDeployHash);

  // await getDeploy(NODE_ADDRESS!, increaseAllowanceJsClientDeployHash);
  // console.log("...IncreaseAllowance JsClient called successfully");

  //decreaseAllowanceJsClient
  // const decreaseAllowanceJsClientDeployHash = await dragonlair.decreaseAllowanceJsClient(
  //   KEYS,
  //   KEYS.publicKey,
  //   ALLOWANCES_AMOUNT!,
  //   TRANSFER_PAYMENT_AMOUNT!
  // );
  // console.log("... DecreaseAllowance JsClient deploy hash: ", decreaseAllowanceJsClientDeployHash);

  // await getDeploy(NODE_ADDRESS!, decreaseAllowanceJsClientDeployHash);
  // console.log("... DecreaseAllowance JsClient called successfully");

  // //transfer
  // const transferDeployHash = await dragonlair.transferJsClient(
  //   KEYS,
  //   KEYS.publicKey,
  //   TRANSFER_AMOUNT!,
  //   TRANSFER_PAYMENT_AMOUNT!
  // );
  // console.log("... Transfer deploy hash: ", transferDeployHash);

  // await getDeploy(NODE_ADDRESS!, transferDeployHash);
  // console.log("... Token transfer successfully");

  // //transfer_from
  // const transferfromDeployHash = await dragonlair.transferFromJsClient(
  //   KEYS,
  //   KEYS.publicKey,
  //   KEYS.publicKey,
  //   TRANSFER_FROM_AMOUNT!,
  //   TRANSFER_FROM_PAYMENT_AMOUNT!
  // );
  // console.log("... TransferFrom deploy hash: ", transferfromDeployHash);

  // await getDeploy(NODE_ADDRESS!, transferfromDeployHash);
  // console.log("... Token transfer successfully");

  //enter

  const enterDeployHash = await dragonlair.enter(
    KEYS,
    "1000000000",
    DRAGONLAIR_FUNCTIONS_PAYMENT_AMOUNT!
  );
  console.log("... enter deploy hash: ", enterDeployHash);

  await getDeploy(NODE_ADDRESS!, enterDeployHash);
  console.log("... Tokens entered successfully");

  //leave

  const leaveDeployHash = await dragonlair.leave(
    KEYS,
    "2",
    DRAGONLAIR_FUNCTIONS_PAYMENT_AMOUNT!
  );
  console.log("... leave deploy hash: ", leaveDeployHash);

  await getDeploy(NODE_ADDRESS!, leaveDeployHash);
  console.log("... Tokens leaved successfully");

  // // //check snowl balance
  let snowBalance = await dragonlair.snowlBalance("24a56544c522eca7fba93fb7a6cef83e086706fd87b2f344f5c3dad3603d11f1",SNOWL_CONTRACT!,DRAGONLAIR_CONTRACT_PACKAGE!,DRAGONLAIR_CONTRACT!);
  console.log(`... snowl Balance after enter functions : ${snowBalance}`);

  // // //oSnowlForSnowlJsClient
  const oSnowlForSnowlJsClientDeployHash = await dragonlair.oSnowlForSnowlJsClient(
    KEYS,
    "30000000000",
    DRAGONLAIR_FUNCTIONS_PAYMENT_AMOUNT!
  );
  console.log("... oSnowlForSnowlJsClient deploy hash: ", oSnowlForSnowlJsClientDeployHash);

  await getDeploy(NODE_ADDRESS!, oSnowlForSnowlJsClientDeployHash);
  console.log("... oSnowlForSnowlJsClient function called successfully");

  // //snowlForOSnowlJsClient
  const snowlForOSnowlJsClientDeployHash = await dragonlair.snowlForOSnowlJsClient(
    KEYS,
    "30000000000",
    DRAGONLAIR_FUNCTIONS_PAYMENT_AMOUNT!
  );
  console.log("... snowlForOSnowlJsClient deploy hash: ", snowlForOSnowlJsClientDeployHash);

  await getDeploy(NODE_ADDRESS!, snowlForOSnowlJsClientDeployHash);
  console.log("... snowlForOSnowlJsClient function called successfully");

};

test();

