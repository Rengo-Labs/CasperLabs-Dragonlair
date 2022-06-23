# CasperLabs-Dragonlair

Implementation of `Dragon Lair` and `ERC20` Contract for the CasperLabs platform.

## Steps

There are 2 contracts in this folder

1. DragonLair Contract
2. ERC20 Contract

## Table of contents

- [Interacting with the contract](#interacting-with-the-contract)
  - [Install the prerequisites](#install-the-prerequisites)
  - [Creating Keys](#creating-keys)
  - [Usage](#usage)
    - [Install](#install)
    - [Build Individual Smart Contract](#build-individual-smart-contract)
    - [Build All Smart Contracts](#build-all-smart-contracts)
    - [Individual Test Cases](#individual-test-cases)
    - [All Test Cases](#all-test-cases)
  - [Known contract hashes](#known-contract-hashes)

### Install the prerequisites

You can install the required software by issuing the following commands. If you are on an up-to-date Casper node, you probably already have all of the prerequisites installed so you can skip this step.

```bash
# Update package repositories
sudo apt update
# Install the command-line JSON processor
sudo apt install jq -y
# Install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
#Install the nightly version (by default stable toolchain is installed)
rustup install nightly
#Check that nightly toolchain version is installed(this will list stable and nightly versions)
rustup toolchain list
#Set rust nightly as default
rustup default nightly
# Install wasm32-unknown-unknown
rustup target add wasm32-unknown-unknown
#rust Version
rustup --version
#Install Cmake
 sudo apt-get -y install cmake
Note:https://cgold.readthedocs.io/en/latest/first-step/installation.html
#cmake Version
cmake --version
#Installing the Casper Crates
cargo install cargo-casper
# Add Casper repository
echo "deb https://repo.casperlabs.io/releases" bionic main | sudo tee -a /etc/apt/sources.list.d/casper.list
curl -O https://repo.casperlabs.io/casper-repo-pubkey.asc
sudo apt-key add casper-repo-pubkey.ascr
sudo apt update
# Install the Casper client software
Install Casper-client
cargo +nightly install casper-client
# To check Casper Client Version
Casper-client --version
# Commands for help
casper-client --help
casper-client <command> --help
```

### Creating Keys

```bash
# Create keys
casper-client keygen <TARGET DIRECTORY>
```

### Usage

To run the Contracts make sure you are in the folder of your required contract.

#### Install

Make sure `wasm32-unknown-unknown` is installed.

```
make prepare
```

It's also recommended to have [wasm-strip](https://github.com/WebAssembly/wabt)
available in your PATH to reduce the size of compiled Wasm.

#### Build Individual Smart Contract

Run this command to build Smart Contract.

```
make build-contract
```

<br>**Note:** User needs to be in the desired project folder to build contracts and User needs to run `make build-contract` in every project to make wasms to avoid errors

#### Build All Smart Contracts

Run this command in main folder to build all Smart Contract.

```
make all
```

#### Individual Test Cases

Run this command to run Test Cases.

```
make test
```

<br>**Note:** User needs to be in the desired project folder to run test cases

#### All Test Cases

Run this command in main folder to run all contract's Test Cases.

```
make test
```

### Deploying DrangonLair contract manually

If you need to deploy the `DragonLair contract` manually you need to pass the some parameters. Following is the command to deploy the `DragonLair contract`.

```bash
sudo casper-client put-deploy \
    --chain-name chain_name \
    --node-address http://$NODE_ADDRESS:7777/ \
    --secret-key path_to_secret_key.pem \
    --session-path path_to_wasm_file \
    --payment-amount 10000000000 \
    --session-arg="public_key:public_key='Public Key In Hex'" \
    --session-arg="quick:Key='erc20-contract-hash'" \
    --session-arg="contract_name:string='contract_name'"
```

## Entry Point methods <a id="DragonLair-entry-point-methods"></a>

Following are the DragonLair's entry point methods.

- #### enter <a id="DragonLair-enter"></a>
  Used to Enter the lair. Pay some staking_token. Earn some dragon staking_token.

Following is the table of parameters.

| Parameter Name | Type |
| -------------- | ---- |
| staking_token_amount   | U256 |

This method **returns** nothing.

- #### leave <a id="DragonLair-leave"></a>
  Used to Leave the lair. Claim back your staking_token.

Following is the table of parameters.

| Parameter Name | Type |
| -------------- | ---- |
| d_staking_token_amount | U256 |

This method **returns** nothing.

- #### quick_balance <a id="DragonLair-staking_token-balance"></a>
  Returns the total amount of staking_token an address has in the contract including fees earned

Following is the table of parameters.

| Parameter Name  | Type |
| --------------- | ---- |
| account         | Key  |

This method **returns** U256.

- #### o_staking_token_for_staking_token <a id="DragonLair-d-staking_token-for-staking_token"></a>
  Returns how much staking_token someone gets for depositing d_staking_token.

Following is the table of parameters.

| Parameter Name  | Type |
| --------------- | ---- |
| d_staking_token_amount  | U256 |

This method **returns** U256.

- #### staking_token_for_d_staking_token <a id="DragonLair-staking_token-for-d-staking_token"></a>
  Returns how much d_staking_token someone gets for depositing staking_token

Following is the table of parameters.

| Parameter Name | Type |
| -------------- | ---- |
| staking_token_amount | U256 |

This method **returns** U256.

### Deploying ERC20 contract manually

If you need to deploy the `ERC20 contract` manually you need to pass the some parameters. Following is the command to deploy the `ERC20 contract`.

```bash
sudo casper-client put-deploy \
    --chain-name chain_name \
    --node-address http://$NODE_ADDRESS:7777/ \
    --secret-key path_to_secret_key.pem \
    --session-path path_to_wasm_file \
    --payment-amount 10000000000 \
    --session-arg="public_key:public_key='Public Key In Hex'" \
    --session-arg="name:string='token-name'" \
    --session-arg="symbol:string='token-symbol'" \
    --session-arg="decimals:u8='unsigned integer value'" \
    --session-arg="initial_supply:u256='unsigned integer value'" \
    --session-arg="contract_name:string='contract_name'"
```

## Entry Point methods <a id="erc20-entry-point-methods"></a>

Following are the ERC20's entry point methods.

- #### transfer <a id="erc20-transfer"></a>
Lets ` self.get_caller() ` send pool tokens to a recipient hash.

Following is the table of parameters.

Parameter Name | Type
---|---
recipient | Key
amount | U256


This method **returns** nothing.

- #### transfer_from <a id="erc20-transfer-from"></a>
Sends pool tokens from one hash to another.
<br>User needs to call approve method before calling the ` tranfer_from `.

Following is the table of parameters.

Parameter Name | Type
---|---
owner | Key
recipient | Key
amount | U256


This method **returns** nothing.
<br>**Recommendation:** 
The exploit is mitigated through use of functions that increase/decrease the allowance relative to its current value, such as `increaseAllowance()` and `decreaseAllowance()`,
Pending community agreement on an ERC standard that would protect against this exploit, we recommend that developers of applications dependent on approve() / transferFrom()
should keep in mind that they have to set allowance to 0 first and verify if it was used before setting the new value.
<br>**Note:**  Teams who decide to wait for such a standard should make these
recommendations to app developers who work with their token contract.

- #### permit <a id="erc20-permit"></a>
Sets the allowance for a spender where approval is granted via a signature.

Following is the table of parameters.

Parameter Name | Type
---|---
public | String
signature | String
owner | Key
spender | Key
value | U256
deadline | u64


This method **returns** nothing.


- #### approve <a id="erc20-approve"></a>
Lets ` self.get_caller() ` set their allowance for a spender.
<br>user needs to call this `approve` method before calling the `transfer_from` method.

Following is the table of parameters.

Parameter Name | Type
---|---
spender | Key
amount | U256

This method **returns** nothing.
<br>**Recommendation:** 
The exploit is mitigated through use of functions that increase/decrease the allowance relative to its current value, such as `increaseAllowance()` and `decreaseAllowance()`,
Pending community agreement on an ERC standard that would protect against this exploit, we recommend that developers of applications dependent on approve() / transferFrom()
should keep in mind that they have to set allowance to 0 first and verify if it was used before setting the new value.
<br>**Note:**  Teams who decide to wait for such a standard should make these
recommendations to app developers who work with their token contract.

- #### balance_of <a id="erc20-balance-of"></a>
This method will return the balance of owner in `ERC20 Contract`.

Following is the table of parameters.

Parameter Name | Type
---|---
owner | Key


This method **returns** U256.


- #### nonce <a id="erc20-nonce"></a>
Returns the current `nonce` for an address for use in ` permit `.

Following is the table of parameters.

Parameter Name | Type
---|---
owner | Key


This method **returns** U256.


- #### allowance <a id="erc20-allowance"></a>
Returns the amount of liquidity tokens owned by an hash that a spender is allowed to transfer via ` transfer_from `.

Following is the table of parameters.

Parameter Name | Type
---|---
owner | Key
spender | Key


This method **returns** U256.


- #### total_supply <a id="erc20-total-supply"></a>
Returns the total amount of pool tokens for a pair.

Following is the table of parameters.

Parameter Name | Type
---|---


This method **returns** U256.


- #### mint <a id="erc20-mint"></a>
This method mints the number of tokens provided by user against the hash provided by user.

Following is the table of parameters.

Parameter Name | Type
---|---
to | Key
amount | U256

This method **returns** nothing.


- #### burn <a id="erc20-burn"></a>
This method burns the number of tokens provided by user against the hash provided by user.

Following is the table of parameters.

Parameter Name | Type
---|---
from | Key
amount | U256

This method **returns** nothing.
<br>**Note:** To `burn` the tokens against the hash provided by user, User needs to `mint` tokens first in `ERC20`.

- #### name <a id="erc20-name"></a>
Returns the `name` of tokens for a pair.

Following is the table of parameters.

Parameter Name | Type
---|---

This method **returns** String.

- #### symbol <a id="erc20-symbol"></a>
Returns the `symbol` of tokens for a pair.

Following is the table of parameters.

Parameter Name | Type
---|---

This method **returns** String.
