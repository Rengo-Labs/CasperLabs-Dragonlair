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
    fn init(&mut self, snowl: Key, contract_hash: Key, package_hash: ContractPackageHash) {
        data::set_snowl(snowl);
        data::set_hash(contract_hash);
        data::set_package_hash(package_hash);
        ERC20::init(
            self,
            "Dragon Snowl".to_string(),
            "osnowl".to_string(),
            9.into(),
            0.into(),
            "".to_string(),
            "".to_string(),
            contract_hash,
            package_hash,
        )
    }
    fn enter(&mut self, snowl_amount: U256) {
        let total_snowl: U256 = runtime::call_versioned_contract(
            data::get_snowl().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let total_o_snowl: U256 = ERC20::total_supply(self);
        if total_o_snowl == 0.into() || total_snowl == 0.into() {
            ERC20::mint(self, self.get_caller(), snowl_amount);
        } else {
            let o_snowl_amount: U256 = snowl_amount
                .checked_mul(total_o_snowl)
                .unwrap_or_revert_with(Error::ArithmaticError1)
                .checked_div(total_snowl)
                .unwrap_or_revert_with(Error::ArithmaticError2);
            ERC20::mint(self, self.get_caller(), o_snowl_amount);
        }
        let ret: Result<(), u32> = runtime::call_versioned_contract(
            data::get_snowl().into_hash().unwrap_or_revert().into(),
            None,
            "transfer_from",
            runtime_args! {
                "owner" => self.get_caller(),
                "recipient" => Key::from(data::get_package_hash()),
                "amount" => snowl_amount
            },
        );
    }
    fn leave(&mut self, o_snowl_amount: U256) {
        let total_o_snowl: U256 = ERC20::total_supply(self);
        let balance_of: U256 = runtime::call_versioned_contract(
            data::get_snowl().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let snowl_amount: U256 = o_snowl_amount
            .checked_mul(balance_of)
            .unwrap_or_revert_with(Error::ArithmaticError3)
            .checked_div(total_o_snowl)
            .unwrap_or_revert_with(Error::ArithmaticError4);
        ERC20::burn(self, self.get_caller(), snowl_amount);
        //Transfer
        let ret: Result<(), u32> = runtime::call_versioned_contract(
            data::get_snowl().into_hash().unwrap_or_revert().into(),
            None,
            "transfer",
            runtime_args! {
                "recipient" => self.get_caller(),
                "amount" => snowl_amount
            },
        );
    }
    fn snowl_balance(&mut self, account: Key) -> U256 {
        let o_snowl_amount: U256 = ERC20::balance_of(self, account);
        let total_o_snowl: U256 = ERC20::total_supply(self);
        let balance_of: U256 = runtime::call_versioned_contract(
            data::get_snowl().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let snowl_amount: U256 = o_snowl_amount
            .checked_mul(balance_of)
            .unwrap_or_revert_with(Error::ArithmaticError5)
            .checked_div(total_o_snowl)
            .unwrap_or_revert_with(Error::ArithmaticError6);
        return snowl_amount;
    }
    fn o_snowl_for_snowl(&mut self, o_snowl_amount: U256) -> U256 {
        let total_o_snowl: U256 = ERC20::total_supply(self);
        let balance_of: U256 = runtime::call_versioned_contract(
            data::get_snowl().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let snowl_amount: U256 = o_snowl_amount
            .checked_mul(balance_of)
            .unwrap_or_revert_with(Error::ArithmaticError6)
            .checked_div(total_o_snowl)
            .unwrap_or_revert_with(Error::ArithmaticError7);
        return snowl_amount;
    }
    fn snowl_for_o_snowl(&mut self, snowl_amount: U256) -> U256 {
        let total_snowl: U256 = runtime::call_versioned_contract(
            data::get_snowl().into_hash().unwrap_or_revert().into(),
            None,
            "balance_of",
            runtime_args! {
                "owner" => Key::from(data::get_package_hash())
            },
        );
        let total_o_snowl: U256 = ERC20::total_supply(self);
        if total_o_snowl == 0.into() || total_snowl == 0.into() {
            let o_snowl_amount: U256 = snowl_amount;
            return o_snowl_amount;
        } else {
            let o_snowl_amount: U256 = snowl_amount
                .checked_mul(total_o_snowl)
                .unwrap_or_revert_with(Error::ArithmaticError8)
                .checked_div(total_snowl)
                .unwrap_or_revert_with(Error::ArithmaticError9);
            return o_snowl_amount;
        }
    }
}
