#pragma once

#include <eosio/eosio.hpp>

using namespace eosio;

typedef std::vector<uint8_t> bytes;

class [[eosio::contract("eosio.evm")]] evm : public eosio::contract {

public:
    using contract::contract;

    struct exec_input {
        std::optional<bytes> context;
        std::optional<bytes> from;
        bytes                to;
        bytes                data;
        std::optional<bytes> value;
    };

    struct exec_callback {
        eosio::name contract;
        eosio::name action;
    };

    [[eosio::action]]
    void exec( const exec_input& input, const std::optional<exec_callback>& callback );
    using exec_action = eosio::action_wrapper<"exec"_n, &evm::exec>;
};

