import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuItemStyles from "./MenuItem.module.css"

type MenuItemProps = {
  title: string;
  href: string;
  external: boolean;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  toggleMenu?: () => void;
  border?: boolean;
};

export const MenuItem = ({ title, href, external, Icon, toggleMenu, border }: MenuItemProps) => {
  const pathname = usePathname();
  return (
    <li key={title} className={MenuItemStyles.MenuItem}>
      <Link
        href={href}
        passHref={external}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn("flex items-center gap-2 py-3 font-normal text-white text-lg", {
          "font-bold": pathname === href,
          "border-r-4 border-backgroundColor": pathname === href && border,
        })}
        onClick={toggleMenu}
      >
        <Icon width={30} height={30} />
        <span>{title}</span>
      </Link>
    </li>
  );
};
