import { useEffect, useRef, useState } from "react";
import {
  Address,
  useNetwork,
  useSwitchNetwork,
  usePublicClient,
  useWalletClient,
  useContractRead,
  useAccount,
} from "wagmi";
import { arbitrumNova } from "viem/chains";
import { BaseError } from "viem";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Fireworks, FireworksHandlers } from "@fireworks-js/react";

import { AIRDROP_ADDR, MOOND_TOKEN_ADDR } from "../contracts";
import AirdropABI from "@/contracts/Airdrop.json";
import SpinnerSVG from "./svg/Spinner";
import AirdropInfo from "./AirdropInfo";
import NOVA from "../assets/NOVA.png";
import Counter from "./Counter";
import MOOND from "../assets/MOOND.png";
import Taco from "@/assets/taco.png";
import Plunger from "@/assets/plunger.png";
import TelegramSVG from "./svg/Telegram";
import TwitterSVG from "./svg/Twitter";
import GlobeSVG from "./svg/Globe";
import Metamask from "@/assets/Metamask.svg";
import InfoCard from "./InfoCard";

const AirdropCard = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  // const address = "0x00f33fd847d48ac64f6f8f3ff577264da59fe882";
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const publicClient = usePublicClient({ chainId: arbitrumNova.id });
  const { data: walletClient } = useWalletClient({ chainId: arbitrumNova.id });
  const [loading, setLoading] = useState(false);
  const [left, setLeft] = useState(0);

  const [firework, setFirework] = useState(false);

  const ref = useRef<FireworksHandlers>(null);

  const launch = () => {
    ref.current?.start();
    setTimeout(() => ref.current?.launch(4), 500);
    setTimeout(() => ref.current?.launch(4), 1000);
    setTimeout(() => ref.current?.launch(4), 1500);
    setTimeout(() => ref.current?.launch(4), 2000);
    setFirework(true);
    setTimeout(() => setFirework(() => false), 3000);
  };

  useEffect(() => {
    ref.current?.stop();
  }, []);

  const { data: airdrop } = useContractRead({
    address: AIRDROP_ADDR[arbitrumNova.id] as Address,
    abi: AirdropABI,
    functionName: "airdrops",
    args: [address],
    enabled: Boolean(address),
    watch: true,
  });

  const { data: startTime } = useContractRead({
    address: AIRDROP_ADDR[arbitrumNova.id] as Address,
    abi: AirdropABI,
    functionName: "startAirdropTime",
  });

  const onAirdrop = async () => {
    if (address && walletClient) {
      if (chain?.id !== arbitrumNova.id) {
        await switchNetworkAsync?.(arbitrumNova.id);
      }
      setLoading(true);
      try {
        const { request } = await publicClient.simulateContract({
          account: address,
          address: AIRDROP_ADDR[arbitrumNova.id] as Address,
          abi: AirdropABI,
          functionName: "airdrop",
          args: [],
        });

        const airdropTx = await walletClient.writeContract(request);

        await publicClient.waitForTransactionReceipt({ hash: airdropTx });
        toast.success("Airdropped successfully");

        launch();
      } catch (err) {
        console.log(err);
        toast.error(
          err instanceof BaseError ? err.shortMessage : JSON.stringify(err)
        );
      }
    } else {
      openConnectModal?.();
    }
    setLoading(false);
  };

  const onAddMetamask = async () => {
    try {
      const res = await walletClient?.watchAsset({
        type: "ERC20",
        options: {
          address: MOOND_TOKEN_ADDR[arbitrumNova.id],
          decimals: 18,
          symbol: "MOOND",
        },
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const airdropped = (airdrop as any)?.[3] === true;
  const airdroppable = (airdrop as any)?.[2] > 0n;

  useEffect(() => {
    if (address && airdroppable) {
      launch();
    }
  }, [address, airdroppable]);

  return (
    <div className="bg-white dark:bg-[#212429] shadow-[#00000003_0_0_1px,#0000000a_0_4px_8px,#0000000a_0_16px_24px,#00000003_0_24px_32px] rounded-[30px] p-4 w-11/12 max-w-[420px] min-w-[320px] relative">
      <Fireworks
        ref={ref}
        options={{
          opacity: 0.7,
          traceSpeed: 1,
          traceLength: 1,
          particles: 80,
          explosion: 7,
          acceleration: 1.2,
          lineWidth: {
            explosion: { min: 0.8, max: 0.8 },
          },
        }}
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          position: "fixed",
          zIndex: firework ? "0" : "-1",
        }}
      />
      <InfoCard className="absolute top-4 right-4" />
      <div className="flex items-center justify-center font-light text-black dark:text-white text-3xl mt-2 text-center px-5">
        {!address
          ? "MoonsDust Airdrop"
          : airdropped
          ? "Congratulation!"
          : airdroppable
          ? `You're Eligible!`
          : `Ah shoot`}
      </div>
      <p className="text-[#565a69] dark:text-[#c3c5cb] text-sm mt-3 text-center">
        {!address
          ? "Connect your wallet to check if you’re eligible!"
          : airdropped
          ? "You claimed the airdrop successfully"
          : airdroppable
          ? "Click on Claim Airdrop to receive the tokens"
          : "Looks like this wallet isn't eligible"}
      </p>
      {!airdropped && (
        <AirdropInfo
          label="Available Airdrop"
          value={airdropped ? 0n : (airdrop as any)?.[2]}
          icon={
            <Image
              src={MOOND.src}
              width={MOOND.width}
              height={MOOND.height}
              alt="moond"
              className="w-[40px]"
            />
          }
          symbol="MOOND"
          blue
          className="mt-6"
        />
      )}
      {!airdropped && (
        <AirdropInfo
          label="Tacon Snapshot Balance"
          value={(airdrop as any)?.[0]}
          icon={
            <Image
              src={Taco.src}
              width={Taco.width}
              height={Taco.height}
              alt="taco"
              className="w-[40px]"
            />
          }
          symbol="TACO"
          className="mt-4"
        />
      )}
      {!airdropped && (
        <AirdropInfo
          label="Plunger Snapshot Balance"
          value={(airdrop as any)?.[1]}
          icon={
            <Image
              src={Plunger.src}
              width={Plunger.width}
              height={Plunger.height}
              alt="plunger"
              className="w-[40px]"
            />
          }
          symbol="PLUNGER"
          className="mt-4"
        />
      )}
      {airdropped && (
        <AirdropInfo
          label="Airdropped Amount"
          value={(airdrop as any)?.[3] === true ? (airdrop as any)?.[2] : 0n}
          symbol="MOOND"
          icon={
            <>
              <Image
                src={MOOND.src}
                width={MOOND.width}
                height={MOOND.height}
                alt="moond"
                className="w-[40px]"
              />
              <Image
                src={NOVA.src}
                width={NOVA.width}
                height={NOVA.height}
                alt="nova"
                className="w-[20px] -mt-2"
              />
            </>
          }
          item={
            <div
              className="flex items-center text-white text-sm bg-[#2e2e2e] py-1 px-1.5 rounded-lg mt-1.5 hover:brightness-110 active:brightness-90 transition-all cursor-pointer -mr-1"
              onClick={onAddMetamask}
            >
              <Image
                src={Metamask.src}
                width={Metamask.width}
                height={Metamask.height}
                alt="metamask"
                className="w-[18px] mr-1"
              />
              Add to Metamask
            </div>
          }
          ticked={airdropped}
          className="mt-4"
        />
      )}
      <div className="flex justify-center items-center text-black dark:text-white space-x-10 mt-6">
        <a
          href="https://t.me/RedditMoon"
          target="_blank"
          rel="noreferrer"
          className="hover:brightness-110 active:brightness-95 transition-all"
        >
          <TelegramSVG className="w-[24px] h-[24px]" />
        </a>
        <a
          href="https://x.com/moonsswap?s=21&t=ILoQ3vOMtOrzB4qjjcNKUA"
          target="_blank"
          rel="noreferrer"
          className="hover:brightness-110 active:brightness-95 transition-all"
        >
          <TwitterSVG className="w-[24px]" />
        </a>

        <a
          href="https://moonsdust.com"
          target="_blank"
          rel="noreferrer"
          className="hover:brightness-110 active:brightness-95 transition-all"
        >
          <GlobeSVG className="w-[24px]" />
        </a>
      </div>
      <Counter
        left={left}
        setLeft={setLeft}
        start={(startTime ?? 0n) as bigint}
        className="mt-6"
      />
      <button
        className="bg-[#00aee9] text-white py-[18px] rounded-[20px] w-full font-medium mt-4 disabled:bg-[#edeef2] disabled:text-[#888d9b] dark:disabled:bg-[#40444f] dark:disabled:text-[#6c7284] flex justify-center"
        onClick={onAirdrop}
        disabled={
          loading || left === 0 || airdropped || (airdrop as any)?.[1] === 0n
        }
      >
        {left === 0 && ((startTime ?? 0n) as bigint) > 0n ? (
          "FINISHED"
        ) : loading ? (
          <SpinnerSVG />
        ) : airdropped ? (
          "CLAIMED"
        ) : address ? (
          "CLAIM AIRDROP"
        ) : (
          "CONNECT WALLET"
        )}
      </button>
    </div>
  );
};

export default AirdropCard;
