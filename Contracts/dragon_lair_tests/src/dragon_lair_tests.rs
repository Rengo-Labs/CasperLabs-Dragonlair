use crate::dragon_lair_instance::DRAGONLAIRInstance;
use casper_types::{account::AccountHash, runtime_args, Key, RuntimeArgs, U256};
use test_env::{TestContract, TestEnv};
pub const TEN_E_NINE: u128 = 1000000000 as u128;
fn deploy_erc20(env: &TestEnv, owner: AccountHash) -> TestContract {
    TestContract::new(
        &env,
        "erc20-token.wasm",
        "erc2020",
        owner,
        runtime_args! {
            "name" => "Reward",
            "symbol" => "rw",
            "decimals" => 9 as u8,
            "initial_supply" => U256::from(TEN_E_NINE * 1000)
        },
    )
}
fn deploy() -> (TestEnv, AccountHash, TestContract, TestContract) {
    let env = TestEnv::new();
    let owner = env.next_user();
    let erc20 = deploy_erc20(&env, owner);
    let dragon_lair_instance =
        DRAGONLAIRInstance::new(&env, "DRAGONLAIR", owner, Key::Hash(erc20.package_hash()));
    // Test Contract For Returning Value
    let dragon_lair_package_hash = Key::Hash(dragon_lair_instance.package_hash());
    let proxy = DRAGONLAIRInstance::proxy(&env, "Proxy", owner, dragon_lair_package_hash);
    // For Minting Purpose
    let spender: Key = Key::from(dragon_lair_package_hash);
    let amount: U256 = U256::from(TEN_E_NINE * 100);
    erc20.call_contract(
        owner,
        "approve",
        runtime_args! {"spender" => spender , "amount" => amount},
    );
    (env, owner, dragon_lair_instance, proxy)
}

#[test]
fn test_deploy() {
    let (_, _, _, _) = deploy();
}
#[test]
fn test_enter() {
    let (_, owner, dragon_lair_instance, _) = deploy();
    let dragon_lair_instance = DRAGONLAIRInstance::contract_instance(dragon_lair_instance);
    dragon_lair_instance.enter(owner, U256::from(TEN_E_NINE * 2));
    dragon_lair_instance.enter(owner, U256::from(TEN_E_NINE * 2));
}
#[test]
fn test_leave() {
    let (_, owner, dragon_lair_instance, _) = deploy();
    let dragon_lair_instance = DRAGONLAIRInstance::contract_instance(dragon_lair_instance);
    dragon_lair_instance.enter(owner, U256::from(TEN_E_NINE * 4));
    dragon_lair_instance.leave(owner, U256::from(TEN_E_NINE * 2));
}
#[test]
fn test_staking_token_balance() {
    let (_, owner, dragon_lair_instance, proxy) = deploy();
    let dragon_lair_instance = DRAGONLAIRInstance::contract_instance(dragon_lair_instance);
    let proxy = DRAGONLAIRInstance::contract_instance(proxy);
    let account: Key = Key::Account(owner);
    dragon_lair_instance.enter(owner, U256::from(TEN_E_NINE * 12));
    proxy.staking_token_balance(owner, account);
}
#[test]
fn test_staking_token_balance_jsclient() {
    let (_, owner, dragon_lair_instance, _) = deploy();
    let dragon_lair_instance = DRAGONLAIRInstance::contract_instance(dragon_lair_instance);
    let account: Key = Key::Account(owner);
    dragon_lair_instance.enter(owner, U256::from(TEN_E_NINE * 2));
    dragon_lair_instance.staking_token_balance_jsclient(owner, account);
}
#[test]
fn test_d_staking_token_for_staking_token() {
    let (_, owner, dragon_lair_instance, proxy) = deploy();
    let dragon_lair_instance = DRAGONLAIRInstance::contract_instance(dragon_lair_instance);
    let proxy = DRAGONLAIRInstance::contract_instance(proxy);
    dragon_lair_instance.enter(owner, U256::from(TEN_E_NINE * 7));
    proxy.d_staking_token_for_staking_token(owner, U256::from(TEN_E_NINE * 2));
}
#[test]
fn test_staking_token_for_d_staking_token() {
    let (_, owner, dragon_lair_instance, proxy) = deploy();
    let dragon_lair_instance = DRAGONLAIRInstance::contract_instance(dragon_lair_instance);
    let proxy = DRAGONLAIRInstance::contract_instance(proxy);
    dragon_lair_instance.enter(owner, U256::from(TEN_E_NINE * 8));
    proxy.staking_token_for_d_staking_token(owner, U256::from(TEN_E_NINE * 2));
}
