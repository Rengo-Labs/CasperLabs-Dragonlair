import {
  CasperClient,
  CLPublicKey,
  CLAccountHash,
  CLByteArray,
  CLKey,
  CLString,
  CLTypeBuilder,
  CLValue,
  CLValueBuilder,
  CLValueParsers,
  CLMap,
  DeployUtil,
  EventName,
  EventStream,
  Keys,
  RuntimeArgs,
} from "casper-js-sdk";
import { Some, None } from "ts-results";
import * as blake from "blakejs";
import { concat } from "@ethersproject/bytes";
import * as utils from "./utils";
import { RecipientType, IPendingDeploy } from "./types";
import {createRecipientAddress } from "./utils";


class DRAGONLAIRClient {
  private contractName: string = "dragonlair";
  private contractHash: string= "dragonlair";
  private contractPackageHash: string= "dragonlair";
  private namedKeys: {
    balances:string,
    snowl_balance_:string,
    metadata: string;
    nonces: string;
    allowances: string;
    ownedTokens: string;
    owners: string;
    paused: string;
    
  };

  constructor(

    private nodeAddress: string,
    private chainName: string,
    private eventStreamAddress?: string,
    
  ) 
  {
    this.namedKeys= {
      balances:"null",
      snowl_balance_:"snowl_balance_",
      metadata: "null",
      nonces: "null",
      allowances: "null",
      ownedTokens: "null",
      owners: "null",
      paused: "null"
    }; 
  }

  public async setContractHash(hash: string) {
    const stateRootHash = await utils.getStateRootHash(this.nodeAddress);
    const contractData = await utils.getContractData(
      this.nodeAddress,
      stateRootHash,
      hash
    );

    const { contractPackageHash, namedKeys } = contractData.Contract!;
    this.contractHash = hash;
    this.contractPackageHash = contractPackageHash.replace(
      "contract-package-wasm",
      ""
    );
    const LIST_OF_NAMED_KEYS = [
      'balances',
      'self_erc20',
      'nonces',
      'allowances',
      `${this.contractName}_package_hash`,
      `${this.contractName}_package_hash_wrapped`,
      `${this.contractName}_contract_hash`,
      `${this.contractName}_contract_hash_wrapped`,
      `${this.contractName}_package_access_token`,
    ];
    // @ts-ignore
    this.namedKeys = namedKeys.reduce((acc, val) => {
      if (LIST_OF_NAMED_KEYS.includes(val.name)) {
        return { ...acc, [utils.camelCased(val.name)]: val.key };
      }
      return acc;
    }, {});
  }

  public async name() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["name"]
    );
    return result.value();
  }

  public async symbol() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["symbol"]
    );
    return result.value();
  }

  public async decimal() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["decimals"]
    );
    return result.value();
  }
  
  public async totalSupply() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash,
      ["total_supply"]
    );
    return result.value();
  }
  public async enter(
    keys: Keys.AsymmetricKey,
    snowlAmount: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      snowl_amount: CLValueBuilder.u256(snowlAmount)
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "enter",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async leave(
    keys: Keys.AsymmetricKey,
    amount: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      o_snowl_amount: CLValueBuilder.u256(amount)
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "leave",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async oSnowlForSnowlJsClient(
    keys: Keys.AsymmetricKey,
    amount: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      o_snowl_amount: CLValueBuilder.u256(amount)
    });


    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "o_snowl_for_snowl_jsclient",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async snowlForOSnowlJsClient(
    keys: Keys.AsymmetricKey,
    amount: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      snowl_amount: CLValueBuilder.u256(amount)
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "snowl_for_o_snowl_jsclient",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async increaseAllowanceJsClient(
    keys: Keys.AsymmetricKey,
    spender: RecipientType,
    amount: string,
    paymentAmount: string
  ) {

    // const _spender = new CLByteArray(
		// 	Uint8Array.from(Buffer.from(spender, "hex"))
		// );
    const runtimeArgs = RuntimeArgs.fromMap({
      spender: utils.createRecipientAddress(spender),
      amount: CLValueBuilder.u256(amount)
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "increase_allowance_jsclient",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async decreaseAllowanceJsClient(
    keys: Keys.AsymmetricKey,
    spender: RecipientType,
    amount: string,
    paymentAmount: string
  ) {

    // const _spender = new CLByteArray(
		// 	Uint8Array.from(Buffer.from(spender, "hex"))
		// );
    const runtimeArgs = RuntimeArgs.fromMap({
      spender: utils.createRecipientAddress(spender),
      amount: CLValueBuilder.u256(amount)
    });


    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "decrease_allowance_jsclient",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async snowlBalanceJsClient(
    keys: Keys.AsymmetricKey,
    account: string,
    paymentAmount: string
  ) {

    const _account=new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(account, "hex"))));
    const runtimeArgs = RuntimeArgs.fromMap({
      account: _account
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "snowl_balance_jsclient",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async balanceOf(account: string) {
    try {
      
      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        account,
        this.namedKeys.balances
      );
      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();

    } catch (error) {
      return "0";
    }
    
  }
  public async snowlBalance(account: string, snowlContractHash : string,dragonLairContractPackage:string,dragonLairContractHash:string ) 
  {
    try {

      let UserBalance= await this.balanceOf(account);
      let tSupply= await this.totalSupply();
      await this.setContractHash(snowlContractHash);
      let dragonLairBalance= await this.balanceOf(dragonLairContractPackage);
      await this.setContractHash(dragonLairContractHash);

      console.log("User Balance: ", UserBalance);
      console.log("Total Supply: " + `${tSupply}`);
      console.log("DragonLair Balance: ", dragonLairBalance);

      console.log(UserBalance + " * " + dragonLairBalance + " / " + `${tSupply}`);
      return (UserBalance*dragonLairBalance)/tSupply;

    } catch (error) {
      return "0";
    }
  }
  public async nonce(account: CLPublicKey) {
    const accountHash = Buffer.from(account.toAccountHash()).toString("hex");
    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      accountHash,
      this.namedKeys.nonces
    );
    const maybeValue = result.value().unwrap();
    return maybeValue.value().toString();
  }

  public async allowance(owner:string, spender:string) {
    try {
      const _spender = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );

      const keyOwner=new CLKey(new CLAccountHash(Uint8Array.from(Buffer.from(owner, "hex"))));
      const keySpender = createRecipientAddress(_spender);
      const finalBytes = concat([CLValueParsers.toBytes(keyOwner).unwrap(), CLValueParsers.toBytes(keySpender).unwrap()]);
      const blaked = blake.blake2b(finalBytes, undefined, 32);
      const encodedBytes = Buffer.from(blaked).toString("hex");

      const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys.allowances
      );

      const maybeValue = result.value().unwrap();
      return maybeValue.value().toString();
    } catch (error) {
      return "0";
    }

  }

  public async approve(
    keys: Keys.AsymmetricKey,
    spender: RecipientType,
    amount: string,
    paymentAmount: string
  ) {

    // const _spender = new CLByteArray(
		// 	Uint8Array.from(Buffer.from(spender, "hex"))
		// );
    const runtimeArgs = RuntimeArgs.fromMap({
      spender: utils.createRecipientAddress(spender),
      amount: CLValueBuilder.u256(amount)
    });


    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "approve",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async transferJsClient(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    amount: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: utils.createRecipientAddress(recipient),
      amount: CLValueBuilder.u256(amount)
    });


    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "transfer_jsclient",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async transferFromJsClient(
    keys: Keys.AsymmetricKey,
    owner: RecipientType,
    recipient: RecipientType,
    amount: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      owner: utils.createRecipientAddress(owner),
      recipient: utils.createRecipientAddress(recipient),
      amount: CLValueBuilder.u256(amount)
    });


    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "transfer_from_jsclient",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async mint(
    keys: Keys.AsymmetricKey,
    to: RecipientType,
    amount: string,
    paymentAmount: string
  ) {
    
    const runtimeArgs = RuntimeArgs.fromMap({
      to:utils.createRecipientAddress(to),
      amount: CLValueBuilder.u256(amount)
    });

    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "mint",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async burn(
    keys: Keys.AsymmetricKey,
    from: RecipientType,
    amount: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      from: utils.createRecipientAddress(from),
      amount: CLValueBuilder.u256(amount)
    });


    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "burn",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
     
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }
  public async permit(
    keys: Keys.AsymmetricKey,
    publicKey: string,
    signature: string,
    owner: RecipientType,
    spender: RecipientType,
    amount: string,
    deadline: string,
    paymentAmount: string
  ) {

    const runtimeArgs = RuntimeArgs.fromMap({
      public: CLValueBuilder.string(publicKey),
      signature: CLValueBuilder.string(signature),
      owner: utils.createRecipientAddress(owner),
      spender: utils.createRecipientAddress(spender),
      value: CLValueBuilder.u256(amount),
      deadline: CLValueBuilder.u64(deadline)
    });


    const deployHash = await contractCall({
      chainName: this.chainName,
      contractHash: this.contractHash,
      entryPoint: "permit",
      keys,
      nodeAddress: this.nodeAddress,
      paymentAmount,
      runtimeArgs,
    });

    if (deployHash !== null) {
      
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

}
interface IContractCallParams {
  nodeAddress: string;
  keys: Keys.AsymmetricKey;
  chainName: string;
  entryPoint: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
  contractHash: string;
}

const contractCall = async ({
  nodeAddress,
  keys,
  chainName,
  contractHash,
  entryPoint,
  runtimeArgs,
  paymentAmount,
}: IContractCallParams) => {
  const client = new CasperClient(nodeAddress);
  const contractHashAsByteArray = utils.contractHashToByteArray(contractHash);

  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(keys.publicKey, chainName),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      contractHashAsByteArray,
      entryPoint,
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );

  // Sign deploy.
  deploy = client.signDeploy(deploy, keys);

  // Dispatch deploy to node.
  const deployHash = await client.putDeploy(deploy);

  return deployHash;
};

const contractSimpleGetter = async (
  nodeAddress: string,
  contractHash: string,
  key: string[]
) => {
  const stateRootHash = await utils.getStateRootHash(nodeAddress);
  const clValue = await utils.getContractData(
    nodeAddress,
    stateRootHash,
    contractHash,
    key
  );

  if (clValue && clValue.CLValue instanceof CLValue) {
    return clValue.CLValue!;
  } else {
    throw Error("Invalid stored value");
  }
};

const toCLMap = (map: Map<string, string>) => {
  const clMap = CLValueBuilder.map([
    CLTypeBuilder.string(),
    CLTypeBuilder.string(),
  ]);
  for (const [key, value] of Array.from(map.entries())) {
    clMap.set(CLValueBuilder.string(key), CLValueBuilder.string(value));
  }
  return clMap;
};

const fromCLMap = (map: Map<CLString, CLString>) => {
  const jsMap = new Map();
  for (const [key, value] of Array.from(map.entries())) {
    jsMap.set(key.value(), value.value());
  }
  return jsMap;
};

export default DRAGONLAIRClient;
