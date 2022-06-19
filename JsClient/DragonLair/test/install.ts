import { config } from "dotenv";
config();
import { DRAGONLAIRClient, utils} from "../src";
import { getDeploy } from "./utils";

import {
  Keys,
} from "casper-js-sdk";

const {
  NODE_ADDRESS,
  EVENT_STREAM_ADDRESS,
  CHAIN_NAME,
  DRAGONLAIR_WASM_PATH,
  DRAGONLAIR_MASTER_KEY_PAIR_PATH,
  DRAGONLAIR_INSTALL_PAYMENT_AMOUNT,
  DRAGONLAIR_CONTRACT_NAME,
  SNOWL_PACKAGE
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
  `${DRAGONLAIR_MASTER_KEY_PAIR_PATH}/public_key.pem`,
  `${DRAGONLAIR_MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const test = async () => {
  const dragonlair = new DRAGONLAIRClient(
    NODE_ADDRESS!,
    CHAIN_NAME!,
    EVENT_STREAM_ADDRESS!
  );

  const installDeployHash = await dragonlair.install(
    KEYS,
    SNOWL_PACKAGE!,
    DRAGONLAIR_CONTRACT_NAME!,
    DRAGONLAIR_INSTALL_PAYMENT_AMOUNT!,
    DRAGONLAIR_WASM_PATH!
  );

  console.log(`... Contract installation deployHash: ${installDeployHash}`);

  await getDeploy(NODE_ADDRESS!, installDeployHash);

  console.log(`... Contract installed successfully.`);

  let accountInfo = await utils.getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

  console.log(`... Account Info: `);
  console.log(JSON.stringify(accountInfo, null, 2));

  const contractHash = await utils.getAccountNamedKeyValue(
    accountInfo,
    `${DRAGONLAIR_CONTRACT_NAME!}_contract_hash`
  );

  console.log(`... Contract Hash: ${contractHash}`);

  const packageHash = await utils.getAccountNamedKeyValue(
    accountInfo,
    `${DRAGONLAIR_CONTRACT_NAME!}_package_hash`
  );

  console.log(`... Package Hash: ${packageHash}`);
};

test();
