#pragma once

#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include "external/intx.hpp"
#include "external/eosio.evm.hpp"
#include "external/silkworm.hpp"

#include <string>

using namespace eosio;
using namespace std;
using namespace intx;

typedef std::vector<uint8_t> bytes;

class [[eosio::contract("evm.callback")]] code : public eosio::contract {
public:
    using contract::contract;

    [[eosio::action]]
    void callback( const int32_t status, bytes data, const std::optional<bytes> context );

    [[eosio::action]]
    void balanceof( const string contract, const string address );

    [[eosio::action]]
    void update( const string contract, const string address, const int64_t amount );
    using update_action = eosio::action_wrapper<"update"_n, &code::update>;

private:
    int64_t bytes_to_int64( const bytes data);
};
