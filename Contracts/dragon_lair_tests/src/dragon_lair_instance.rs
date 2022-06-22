use casper_types::{
    account::AccountHash, bytesrepr::FromBytes, runtime_args, CLTyped, ContractPackageHash, Key,
    RuntimeArgs, U256,
};
use std::collections::BTreeMap;
use test_env::{TestContract, TestEnv};
pub type TokenId = U256;
pub type Meta = BTreeMap<String, String>;

pub struct DRAGONLAIRInstance(TestContract);

impl DRAGONLAIRInstance {
    pub fn contract_instance(contract: TestContract) -> DRAGONLAIRInstance {
        DRAGONLAIRInstance(contract)
    }
    pub fn new(
        env: &TestEnv,
        contract_name: &str,
        sender: AccountHash,
        staking_token: Key,
    ) -> TestContract {
        TestContract::new(
            env,
            "dragon_lair.wasm",
            contract_name,
            sender,
            runtime_args! {
                "staking_token" => staking_token
            },
        )
    }
    pub fn proxy(
        env: &TestEnv,
        contract_name: &str,
        sender: AccountHash,
        dragon_lair: Key,
    ) -> TestContract {
        TestContract::new(
            env,
            "dragon_lair_test.wasm",
            contract_name,
            sender,
            runtime_args! {
                "dragon_lair" => dragon_lair
            },
        )
    }
    pub fn enter(&self, sender: AccountHash, staking_token_amount: U256) {
        self.0.call_contract(
            sender,
            "enter",
            runtime_args! {
                "staking_token_amount" => staking_token_amount
            },
        );
    }
    pub fn leave(&self, sender: AccountHash, d_staking_token_amount: U256) {
        self.0.call_contract(
            sender,
            "leave",
            runtime_args! {
                "d_staking_token_amount" => d_staking_token_amount
            },
        );
    }
    pub fn staking_token_balance(&self, sender: AccountHash, account: Key) {
        self.0.call_contract(
            sender,
            "staking_token_balance",
            runtime_args! {
                "account" => account
            },
        );
    }
    pub fn staking_token_balance_jsclient(&self, sender: AccountHash, account: Key) {
        self.0.call_contract(
            sender,
            "staking_token_balance_jsclient",
            runtime_args! {
                "account" => account
            },
        );
    }
    pub fn d_staking_token_for_staking_token(&self, sender: AccountHash, d_staking_token_amount: U256) {
        self.0.call_contract(
            sender,
            "d_staking_token_for_staking_token",
            runtime_args! {
                "d_staking_token_amount" => d_staking_token_amount
            },
        );
    }
    pub fn staking_token_for_d_staking_token(&self, sender: AccountHash, staking_token_amount: U256) {
        self.0.call_contract(
            sender,
            "staking_token_for_d_staking_token",
            runtime_args! {
                "staking_token_amount" => staking_token_amount
            },
        );
    }
    // Result methods
    pub fn result_staking_token_balance<T: CLTyped + FromBytes>(&self, owner: Key) -> T {
        let owner: String = "staking_token_balance_".to_string() + &owner.to_formatted_string();
        self.0.query_named_key(owner)
    }
    pub fn result<T: CLTyped + FromBytes>(&self) -> T {
        self.0.query_named_key("total_supply".to_string())
    }
    pub fn package_hash(&self) -> ContractPackageHash {
        self.0.query_named_key("self_package_hash".to_string())
    }
}
