import Link from "next/link";
import Image from "next/image";
import { Menu } from "./menu";
import { FooterLinks, SocialLinks } from "./footer";

export default function Sidebar() {
  return (
    <aside id="sidebar" className="fixed left-0 top-0 z-40 hidden h-screen w-52 md:block" aria-label="Sidebar">
      <div className="bg-dragonPurple flex h-full flex-col justify-between overflow-y-auto py-4 " style={{borderTopRightRadius: 32, borderBottomRightRadius: 32}}>
        <div>
          <div className="flex h-24 items-center p-4">
            <Link href="/">
              <Image
                src={"/images/logo/status-network-wrapped.png"}
                alt="Status Network logo"
                width={100}
                height={0}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>
          <div className="pl-4">
            <Menu border />
          </div>
        </div>
        <div className="px-4">
          <FooterLinks />
          <SocialLinks />
        </div>
      </div>
    </aside>
  );
}
