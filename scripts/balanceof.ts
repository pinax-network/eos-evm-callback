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

function balanceOf(session: Session, contract: string, address: string): AnyAction {
    return {
        account: session.actor,
        name: "balanceof",
        authorization: [session.permissionLevel],
        data: {
            contract,
            address,
        },
    }
}

const contract = "9fC25190baC66D7be4639268220d1Bd363ca2698";
const addresses = [
    "550B8c0819E5FB10AaE5148d0E6E3BC5F1329C1A",
    "0ca39Da8722aB74B6B3581011e1A2f9d2deeC851",
    "22a25Fe7870415d5A958490Ce8b61bCC60C0bBE0",
    "Ad344b0a0e69C93d55FCa397F92CE9E190b05118",
    "2Cbda235Dc358fA285373757e22e21f3DEAB6551"
]
const actions = addresses.map(address => balanceOf(session, contract, address));
const response = await session.transact({actions}, {broadcast: true});
console.log(response);
