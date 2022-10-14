import { contractAddresses, abi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
//import { useNotification } from "web3uikit";
import { CryptoCards, Button } from "@web3uikit/web3";
import { ethers } from "ethers";

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const [entranceFee, setEntranceFee] = useState("0");

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddresses,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = await getEntranceFee();
                setEntranceFee(entranceFeeFromCall);
            }
            updateUI();
        }
    }, [isWeb3Enabled]);

    return (
        <div>
            Hi from LotteryEntrance
            {raffleAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterRaffle();
                            console.log("hjhkjbh");
                        }}
                    >
                        Enter Raffle
                    </button>
                    Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} Eth
                </div>
            ) : (
                <div>No Raffle Address Detect !</div>
            )}
        </div>
    );
}
