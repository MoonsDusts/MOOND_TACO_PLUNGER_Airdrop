import Image from "next/image";

import Logo from "@/assets/MOOND.png";
import ConnectWallet from "@/components/ConnectWallet";
import ThemeButton from "@/components/ThemeButton";

const Header = () => {
  return (
    <div className="w-full flex justify-center border-b border-black/10">
      <div className="container flex justify-between items-center p-3">
        <a href={"/"} className="hover:-rotate-[8deg] transition-all">
          <Image
            src={Logo.src}
            width={50}
            height={50}
            alt="rcp"
            className="w-[50px]"
          />
        </a>
        <div className="flex items-center space-x-[8px]">
          <ConnectWallet />
          <ThemeButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
