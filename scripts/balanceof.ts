import { AnyAction, Session, PrivateKey } from "@wharfkit/session";
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

const action = balanceOf(session);
const response = await session.transact({action}, {broadcast: true});
console.log(response);
