import Image from "next/image";
import Link from "next/link";

export const SocialLinks = () => (
  <div className="flex items-center gap-3 py-2">
    <Link href={"https://x.com/ethstatus"} passHref target="_blank" rel="noopener noreferrer">
      <Image src={"/images/logo/sidebar/twitter.svg"} alt="Linea logo" width={20} height={16} />
    </Link>
    <Link href={"https://discord.gg/linea"} passHref target="_blank" rel="noopener noreferrer">
      <Image src={"/images/logo/sidebar/discord.svg"} alt="Linea logo" width={22} height={16} />
    </Link>
  </div>
);
