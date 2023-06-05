import { Bytes, Struct, Name, AnyAction, Session, PrivateKey } from "@wharfkit/session";
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

@Struct.type('callback')
class Callback extends Struct {
    @Struct.field(Name) declare contract: Name
    @Struct.field(Name) declare action: Name
}

@Struct.type('input')
class Input extends Struct {
    @Struct.field(Bytes) declare context?: Bytes
    @Struct.field(Bytes) declare from?: Bytes
    @Struct.field(Bytes) declare to: Bytes
    @Struct.field(Bytes) declare data: Bytes
    @Struct.field(Bytes) declare value?: Bytes
}

@Struct.type('exec')
class Exec extends Struct {
    @Struct.field(Input) declare input: Input
    @Struct.field(Callback) declare callback: Callback
}

// https://github.com/eosnetworkfoundation/eos-evm/blob/8f649397c2f20cd66dd936440c735569bbf969c3/contract/tests/exec_tests.cpp#L72-L82
function exec(session: Session): AnyAction {
    const to = Bytes.from("9fC25190baC66D7be4639268220d1Bd363ca2698"); // contract_addr
    const data = new Bytes();
    data.append(Bytes.from("a9059cbb")); // sha3(transfer(address,uint256))[:4]
    data.append(Bytes.from("550B8c0819E5FB10AaE5148d0E6E3BC5F1329C1A")); // account.address

    return {
        account: "eosio.evm",
        name: "exec",
        authorization: [session.permissionLevel],
        data: Exec.from({
            input: Input.from({
                context: new Bytes(),
                from: new Bytes(),
                to,
                data,
                value: new Bytes(),
            }),
            callback: Callback.from({
                contract: Name.from(session.actor),
                action: Name.from("callback"),
            })
        }),
    }
}

const action = exec(session);
const response = await session.transact({action}, {broadcast: false})
// console.log(response);