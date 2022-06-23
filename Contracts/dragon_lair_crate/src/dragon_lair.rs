use crate::alloc::string::ToString;
use crate::data;
use casper_contract::{contract_api::runtime, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{runtime_args, ApiError, ContractPackageHash, Key, RuntimeArgs, U256};
use contract_utils::{ContractContext, ContractStorage};
use erc20_crate::{self, ERC20};
//Errors
#[repr(u16)]
pub enum Error {
    /// Arithmatic Error 1
    ArithmaticError1 = 20501,
    /// Arithmatic Error 2
    ArithmaticError2 = 20502,
    /// Arithmatic Error 3
    ArithmaticError3 = 20503,
    /// Arithmatic Error 4
    ArithmaticError4 = 20504,
    /// Arithmatic Error 5
    ArithmaticError5 = 20505,
    /// Arithmatic Error 6
    ArithmaticError6 = 20506,
    /// Arithmatic Error 7
    ArithmaticError7 = 20507,
    /// Arithmatic Error 8
    ArithmaticError8 = 20508,
    /// Arithmatic Error 9
    ArithmaticError9 = 20509,
}

impl From<Error> for ApiError {
    fn from(error: Error) -> ApiError {
        ApiError::User(error as u16)
    }
}
pub trait DRAGONLAIR<Storage: ContractStorage>: ContractContext<Storage> + ERC20<Storage> {
    fn init(&mut self, staking_token: Key, contract_hash: Key, package_hash: ContractPackageHash) {
        data::set_staking_token(staking_token);
        data::set_hash(contract_hash);
        data::set_package_hash(package_hash);
        ERC20::init(
            self,
            "Reward Token".to_string(),
            "reward".to_string(),
            9.into(),
            0.into(),
            "".to_string(),
            "".to_string(),
            contract_hash,
            package_hash,
        )
    }
    fn enter(&mut self, staking_token_amount: U256) {
        let total_staking_token: U256 = runtime::call_versioned_contract(
            data::get_staking_token().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let total_d_staking_token: U256 = ERC20::total_supply(self);
        if total_d_staking_token == 0.into() || total_staking_token == 0.into() {
            ERC20::mint(self, self.get_caller(), staking_token_amount);
        } else {
            let d_staking_token_amount: U256 = staking_token_amount
                .checked_mul(total_d_staking_token)
                .unwrap_or_revert_with(Error::ArithmaticError1)
                .checked_div(total_staking_token)
                .unwrap_or_revert_with(Error::ArithmaticError2);
            ERC20::mint(self, self.get_caller(), d_staking_token_amount);
        }
        let ret: Result<(), u32> = runtime::call_versioned_contract(
            data::get_staking_token().into_hash().unwrap_or_revert().into(),
            None,
            "transfer_from",
            runtime_args! {
                "owner" => self.get_caller(),
                "recipient" => Key::from(data::get_package_hash()),
                "amount" => staking_token_amount
            },
        );
    }
    fn leave(&mut self, d_staking_token_amount: U256) {
        let total_d_staking_token: U256 = ERC20::total_supply(self);
        let balance_of: U256 = runtime::call_versioned_contract(
            data::get_staking_token().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let staking_token_amount: U256 = d_staking_token_amount
            .checked_mul(balance_of)
            .unwrap_or_revert_with(Error::ArithmaticError3)
            .checked_div(total_d_staking_token)
            .unwrap_or_revert_with(Error::ArithmaticError4);
        ERC20::burn(self, self.get_caller(), staking_token_amount);
        //Transfer
        let ret: Result<(), u32> = runtime::call_versioned_contract(
            data::get_staking_token().into_hash().unwrap_or_revert().into(),
            None,
            "transfer",
            runtime_args! {
                "recipient" => self.get_caller(),
                "amount" => staking_token_amount
            },
        );
    }
    fn staking_token_balance(&mut self, account: Key) -> U256 {
        let d_staking_token_amount: U256 = ERC20::balance_of(self, account);
        let total_d_staking_token: U256 = ERC20::total_supply(self);
        let balance_of: U256 = runtime::call_versioned_contract(
            data::get_staking_token().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let staking_token_amount: U256 = d_staking_token_amount
            .checked_mul(balance_of)
            .unwrap_or_revert_with(Error::ArithmaticError5)
            .checked_div(total_d_staking_token)
            .unwrap_or_revert_with(Error::ArithmaticError6);
        return staking_token_amount;
    }
    fn d_staking_token_for_staking_token(&mut self, d_staking_token_amount: U256) -> U256 {
        let total_d_staking_token: U256 = ERC20::total_supply(self);
        let balance_of: U256 = runtime::call_versioned_contract(
            data::get_staking_token().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let staking_token_amount: U256 = d_staking_token_amount
            .checked_mul(balance_of)
            .unwrap_or_revert_with(Error::ArithmaticError6)
            .checked_div(total_d_staking_token)
            .unwrap_or_revert_with(Error::ArithmaticError7);
        return staking_token_amount;
    }
    fn staking_token_for_d_staking_token(&mut self, staking_token_amount: U256) -> U256 {
        let total_staking_token: U256 = runtime::call_versioned_contract(
            data::get_staking_token().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let total_d_staking_token: U256 = ERC20::total_supply(self);
        if total_d_staking_token == 0.into() || total_staking_token == 0.into() {
            let d_staking_token_amount: U256 = staking_token_amount;
            return d_staking_token_amount;
        } else {
            let d_staking_token_amount: U256 = staking_token_amount
                .checked_mul(total_d_staking_token)
                .unwrap_or_revert_with(Error::ArithmaticError8)
                .checked_div(total_staking_token)
                .unwrap_or_revert_with(Error::ArithmaticError9);
            return d_staking_token_amount;
        }
    }
}
