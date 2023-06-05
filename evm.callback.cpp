#include "evm.callback.hpp"
#include "external/intx.hpp"

[[eosio::action]]
void code::callback( const int32_t status, const bytes data, const std::optional<bytes> context )
{
    check(get_first_receiver() == get_self(), "callback must be called by self");
}

[[eosio::action]]
void code::balanceof( const string address, const asset balance )
{
    require_auth( get_self() );
}
