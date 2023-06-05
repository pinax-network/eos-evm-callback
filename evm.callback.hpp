#pragma once

#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>

#include <string>

using namespace eosio;
using namespace std;

typedef std::vector<uint8_t> bytes;

struct exec_output {
    int32_t              status;
    bytes                data;
    std::optional<bytes> context;
};

// static constexpr string balanceOf = "70a08231"; // sha3(balanceOf(address))[:4]

class [[eosio::contract("evm.callback")]] code : public eosio::contract {
public:
    using contract::contract;

    [[eosio::action]]
    void callback( const int32_t status, const bytes data, const std::optional<bytes> context );

    [[eosio::action]]
    void balanceof( const string address, const asset balance );
};
