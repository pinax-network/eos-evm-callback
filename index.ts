import { Bytes, Struct, Name, AnyAction, Session, PrivateKey, Int32 } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import "dotenv/config";

const actor = "evmcallback1";
const permission = "active"
if (!process.env.PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY environment variable");
const privateKey = PrivateKey.from(process.env.PRIVATE_KEY);

const chain = {
    id: "73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d",
    url: "https://jungle4.api.eosnation.io",
}

const session = new Session({
    chain,
    actor,
    permission,
    walletPlugin: new WalletPluginPrivateKey(privateKey),
})

// https://github.com/eosnetworkfoundation/eos-evm/blob/8f649397c2f20cd66dd936440c735569bbf969c3/contract/tests/exec_tests.cpp#L72-L82
function balanceOf(session: Session): AnyAction {
    return {
        account: session.actor,
        name: "balanceof",
        authorization: [session.permissionLevel],
        data: {
            contract: "9fC25190baC66D7be4639268220d1Bd363ca2698",
            address: "550B8c0819E5FB10AaE5148d0E6E3BC5F1329C1A",
        },
    }
}


// https://github.com/eosnetworkfoundation/eos-evm/blob/8f649397c2f20cd66dd936440c735569bbf969c3/contract/tests/exec_tests.cpp#L72-L82
function exec(session: Session): AnyAction {

    const to = Bytes.from("9fC25190baC66D7be4639268220d1Bd363ca2698"); // contract_addr
    const data = new Bytes();
    data.append(Bytes.from("70a08231")); // sha3(balanceOf(address))[:4]
    data.append(Bytes.from("000000000000000000000000550B8c0819E5FB10AaE5148d0E6E3BC5F1329C1A"));


    // data.append(Bytes.from("48dAB0EF543daAb424e2692A9Eb9703a5D713Cde")); // account.address

    return {
        account: "eosio.evm",
        name: "exec",
        authorization: [session.permissionLevel],
        data: {
            input: {
                // context: new Bytes(),
                // from: new Bytes(),
                to,
                data,
                // value: new Bytes(),
            },
            callback: {
                contract: Name.from(session.actor),
                action: Name.from("callback"),
            }
        },
    }
}

// const action = exec(session);
// const response = await session.transact({action}, {broadcast: false});
// if ( response.resolved ) {
//     const compute = await session.client.v1.chain.compute_transaction(response.resolved.transaction)
//     const {return_value_hex_data} = compute.processed.action_traces[0];
//     console.log(return_value_hex_data);
//     console.log(new Output(return_value_hex_data));
// }

const action = balanceOf(session);
const response = await session.transact({action}, {broadcast: true});
console.log(response);

// const balance = Bytes.from("0000000000000000000000000000000000000000000004698c5e1bd5665760ed");
// console.log(balance.toString())