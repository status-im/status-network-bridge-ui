import Image from "next/image";
import Link from "next/link";

export const SocialLinks = () => (
  <div className="flex items-center gap-3 py-2">
    <Link href={"https://x.com/statusL2"} passHref target="_blank" rel="noopener noreferrer">
      <Image src={"/images/logo/sidebar/twitter.svg"} alt="X Logo" width={20} height={16} />
    </Link>
    <Link href={"https://t.me/statusl2"} passHref target="_blank" rel="noopener noreferrer">
      <Image src={"/images/logo/sidebar/telegram.svg"} alt="Telegram logo" width={22} height={16} />
    </Link>
  </div>
);
