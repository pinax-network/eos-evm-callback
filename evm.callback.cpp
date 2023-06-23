#include "evm.callback.hpp"

int64_t code::bytes_to_int64( const bytes data) {
    eosio::check(data.size() == 32, "bytes_to_int64: wrong length");
    auto v = intx::be::unsafe::load<uint256>(data.data()) / pow(10, 14); // reduce precision
    eosio::check(v <= numeric_limits<int64_t>::max(), "bytes_to_int64: out of range");
    return int64_t(v);
}

[[eosio::action]]
void code::callback( const int32_t status, const bytes data, const std::optional<bytes> context )
{
    check(get_first_receiver() == get_self(), "callback must initially be called by this contract");
    const int64_t amount = bytes_to_int64(data);
    const string context_str = silkworm::to_hex(*context, false);
    const bytes contract = *silkworm::from_hex(context_str.substr(0, 40));
    const bytes address = *silkworm::from_hex(context_str.substr(40, 40));

    // Push transaction
    update_action update{ get_self(), { get_self(), "active"_n } };
    update.send( contract, address, amount );
}

[[eosio::action]]
void code::balanceof( const bytes contract, const bytes address )
{
    // balanceOf address
    bytes data;
    bytes method = *silkworm::from_hex("70a08231"); // sha3(balanceOf(address))[:4]
    bytes padding = *silkworm::from_hex("000000000000000000000000");
    data.insert(data.end(), method.begin(), method.end());
    data.insert(data.end(), padding.begin(), padding.end());
    data.insert(data.end(), address.begin(), address.end());

    // Inputs
    evm_contract::exec_input input;
    input.data = data;
    input.to = contract;

    // Context
    bytes context; // contract + address
    context.insert(context.end(), contract.begin(), contract.end());
    context.insert(context.end(), address.begin(), address.end());
    input.context = context;

    // Callback
    evm_contract::exec_callback callback;
    callback.contract = get_self();
    callback.action = "callback"_n;

    // Push transaction
    evm_contract::exec_action exec{ "eosio.evm"_n, { get_self(), "active"_n } };
    exec.send( input, callback );
}

[[eosio::action]]
void code::update( const bytes contract, const bytes address, const int64_t amount )
{
    require_auth( get_self() );
}
