#include "evm.callback.hpp"

int64_t code::bytes_to_int64( const bytes data )
{
    auto v = intx::be::load<uint256>(data.data());
    return int64_t(v);
}

[[eosio::action]]
void code::callback( const int32_t status, bytes data, const std::optional<bytes> context )
{
    check(get_first_receiver() == get_self(), "callback must be called by self");
    const int64_t balance = bytes_to_int64(data);
    print("balance: ", balance);
}

[[eosio::action]]
void code::balanceof( const string address, const asset balance )
{
    require_auth( get_self() );
}
