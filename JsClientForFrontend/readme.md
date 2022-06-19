# Casperlabs-DragonLair-JsClient

This repo has the code to deploy all the functions of dragonlair contracts using dragonlair contract hash

## Prerequisite

Make sure you have created, pasted and funded the keys before testing.

## Testing

Use the script file in package.json to perform the testing
```
"scripts": {
    "test:dragonlairinstalled": "ts-node DRAGONLAIR/test/installed.ts"
  },
```

Use the following commands to perform testing
```
npm run test:dragonlairinstalled


```

* CONFIGURE .env BEFORE TESTING

## How to Query Dictionary Item Keys using JsClient

This has already been done, see the balanceOf function of Dragonlair

https://github.com/Scytalelabs-official/CasperLabs-Dragonlair/blob/main/JsClientForFrontend/DragonLair/src/dragonlair.ts#L369


## How to Query Dictionary Item Keys using cli

Command:

```
casper-client get-dictionary-item --dictionary-item-key 24a56544c522eca7fba93fb7a6cef83e086706fd87b2f344f5c3dad3603d11f1 --dictionary-name balances --node-address http://159.65.118.250:7777 --state-root-hash 063ffc1f3749dc761e79531c103bce19ed1f1f536e9482668e92b0e01462d2a9 --seed-uref uref-17a7812655bf31ca098cb776d3f741b711785040d5cb4bbf0107e10ad6ebdbfe-007
```

Explanation:

* --dictionary-item-key would be the accountHash in case of balance query without the prefix hash-

* --dictionary-name would be the name of the dictionary we want to query

* --node-address will be the address on which we are doing deployments

* --state-root-hash can be found using this command 

```
casper-client get-state-root-hash --node-address http://159.65.118.250:7777
```

* --seed-uref is the key of the dictionary name, in our case balances dictionary name key can be found using this command 

```
casper-client query-state --node-address http://159.65.118.250:7777 --state-root-hash 063ffc1f3749dc761e79531c103bce19ed1f1f536e9482668e92b0e01462d2a9 --key hash-0b5505e1705b0033c686c54a8d42506f39558a4782c7a7b453a2ab570a0d6677

```


