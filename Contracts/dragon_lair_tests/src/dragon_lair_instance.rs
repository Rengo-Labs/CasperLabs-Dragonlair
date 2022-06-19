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
        snowl: Key,
    ) -> TestContract {
        TestContract::new(
            env,
            "dragon_lair.wasm",
            contract_name,
            sender,
            runtime_args! {
                "snowl" => snowl
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
    pub fn enter(&self, sender: AccountHash, snowl_amount: U256) {
        self.0.call_contract(
            sender,
            "enter",
            runtime_args! {
                "snowl_amount" => snowl_amount
            },
        );
    }
    pub fn leave(&self, sender: AccountHash, o_snowl_amount: U256) {
        self.0.call_contract(
            sender,
            "leave",
            runtime_args! {
                "o_snowl_amount" => o_snowl_amount
            },
        );
    }
    pub fn snowl_balance(&self, sender: AccountHash, account: Key) {
        self.0.call_contract(
            sender,
            "snowl_balance",
            runtime_args! {
                "account" => account
            },
        );
    }
    pub fn snowl_balance_jsclient(&self, sender: AccountHash, account: Key) {
        self.0.call_contract(
            sender,
            "snowl_balance_jsclient",
            runtime_args! {
                "account" => account
            },
        );
    }
    pub fn o_snowl_for_snowl(&self, sender: AccountHash, o_snowl_amount: U256) {
        self.0.call_contract(
            sender,
            "o_snowl_for_snowl",
            runtime_args! {
                "o_snowl_amount" => o_snowl_amount
            },
        );
    }
    pub fn snowl_for_o_snowl(&self, sender: AccountHash, snowl_amount: U256) {
        self.0.call_contract(
            sender,
            "snowl_for_o_snowl",
            runtime_args! {
                "snowl_amount" => snowl_amount
            },
        );
    }
    pub fn mint(&self, sender: AccountHash, to: Key, amount: U256) {
        self.0.call_contract(
            sender,
            "mint",
            runtime_args! {
                "to" => to,
                "amount" => amount
            },
        );
    }
    pub fn increase_allowance(&self, sender: AccountHash, spender: Key, amount: U256) {
        self.0.call_contract(
            sender,
            "increase_allowance",
            runtime_args! {
                "spender" => spender,
                "amount" => amount
            },
        );
    }
    // Result methods
    pub fn result_snowl_balance<T: CLTyped + FromBytes>(&self,owner:Key) -> T {
        let owner:String = "snowl_balance_".to_string()+ &owner.to_formatted_string();
        self.0.query_named_key(owner)
    }
    pub fn result<T: CLTyped + FromBytes>(&self) -> T {
        self.0.query_named_key("total_supply".to_string())
    }
    pub fn package_hash(&self) -> ContractPackageHash {
        self.0.query_named_key("self_package_hash".to_string())
    }
}
