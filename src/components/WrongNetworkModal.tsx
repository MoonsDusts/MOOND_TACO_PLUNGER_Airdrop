import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { bscTestnet } from "viem/chains";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { Inter } from "next/font/google";

import CloseSVG from "./svg/Close";

const inter = Inter({ subsets: ["latin"] });

const WrongNetworkModal = () => {
  const [open, setOpen] = useState(false);
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  useEffect(() => {
    if (chain && chain.id !== bscTestnet.id) setOpen(true);
    else setOpen(false);
  }, [chain]);

  const onSwitch = async () => {
    try {
      if (chain?.id !== bscTestnet.id)
        await switchNetworkAsync?.(bscTestnet.id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className={inter.className}
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden={true}></div>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-[20px] overflow-hidden w-[50vw] min-w-fit whitespace-nowrap bg-white dark:bg-[#212429] shadow-[#2f80ed0d_0_4px_8px_0] dark:shadow-[#0000000d_0_4px_8px_0]">
          <Dialog.Title className="p-4 font-medium relative text-black dark:text-white">
            Wrong Network
            <button
              className="absolute right-4 top-0 bottom-0"
              onClick={() => setOpen(false)}
            >
              <CloseSVG />
            </button>
          </Dialog.Title>
          <div className="bg-[#f7f8fa] dark:bg-[#2c2f36] p-8">
            <button
              className="bg-[#00aee9] dark:bg-[#2172e5] text-white rounded-[8px] py-2 px-4 w-full min-w-fit hover:brightness-90 active:brightness-95 transition-all"
              onClick={onSwitch}
            >
              Click here to connect to Arbitrum Nova
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default WrongNetworkModal;
