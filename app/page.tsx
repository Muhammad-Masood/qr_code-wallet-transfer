"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import {
  ConnectButton,
  useConnectModal,
  useSendTransaction,
} from "thirdweb/react";
import { transfer } from "thirdweb/extensions/erc20";
import { sepolia } from "thirdweb/chains";
import { useActiveWallet } from "thirdweb/react";
import { getWalletBalance } from "thirdweb/wallets";
import { Html5QrcodeResult, Html5QrcodeScanner } from "html5-qrcode";
import Html5QrcodePlugin from "./QRCodeScanner";

const client = createThirdwebClient({
  clientId: "628fbb61075a9f7fb935689b4d734460",
});

const USDT_address = "0xa9Ba4c34e2c23432C9DdC539f9e2A7E681e491ac";

export default function Home() {
  const [details, setDetails] = useState({
    amount: 0,
    spender: "",
    token: USDT_address,
  });
  const { connect } = useConnectModal();
  const { mutate: sendTx } = useSendTransaction();
  const wallet = useActiveWallet();
  const [scanResult, setScanResult] = useState();

  // html5QrcodeScanner.render(onScanSuccess, onScanFailure);

  // function onScanSuccess(decodedText: string, result: Html5QrcodeResult) {
  //   console.log("success!");
  //   console.log(result);
  // }

  function onScanFailure(error: any) {
    console.log(error);
    throw new Error(error);
  }

  async function transferUSDT() {
    console.log(details);
    const contract = getContract({
      address: details.token,
      chain: sepolia,
      client: client,
    });

    const tx = await transfer({
      contract: contract,
      to: details.spender,
      amount: details.amount,
    });
    sendTx(tx);
    console.log("transferred!");
  }

  useEffect(() => {
    console.log("inside_useEffect");

    // let html5QrcodeScanner = new Html5QrcodeScanner(
    //   "reader",
    //   { fps: 10, qrbox: {width: 250, height: 250} },
    // /* verbose= */ false);
    // async function success(result: any) {
    //   console.log("success_called!");
    //   setScanResult(result);
    //   await transferUSDT();
    // }

    // const scanner = new Html5QrcodeScanner(
    //   "reader",
    //   {
    //     qrbox: { width: 250, height: 250 },
    //     fps: 5,
    //   },
    //   false
    // );

    // scanner.render(success, (error) => console.log(error));

    // return () => {
    //   scanner.pause();
    // };
  }, []);

  async function handleConnect() {
    const wallet = await connect({ client }); // opens the connect modal
    console.log("connected to", wallet);
  }

  const onNewScanResult = async (decodedText: any, decodedResult: any) => {
    // handle decoded results here
    // console.log(decodedResult, decodedText);
    console.log(details);
    await transferUSDT();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-4">
      <button onClick={handleConnect}>
        {wallet ? wallet.getAccount()!.address : "Connect Wallet"}
      </button>
      <input
        className="border-2 border-y-slate-950 p-2"
        placeholder="Enter spender address"
        onChange={async (e) =>
          setDetails({ ...details, spender: e.target.value })
        }
      />
      <input
        className="border-2 border-y-slate-950"
        type="number"
        placeholder="Enter amount to approve"
        value={details.amount}
        onChange={async (e) =>
          setDetails({ ...details, amount: Number(e.target.value) })
        }
      />
      <input
        placeholder="Enter token address"
        value={details.token}
        onChange={(e) => setDetails({ ...details, token: e.target.value })}
      />
      <button
        className="bg-black text-white rounded-full px-3 py-1"
        onClick={transferUSDT}
      >
        Transfer
      </button>
      {/* {scanResult ? (
        <p>{scanResult}</p>
      ) : (
        <div id="reader" className="w-96"></div>
      )} */}
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </div>
  );
}
