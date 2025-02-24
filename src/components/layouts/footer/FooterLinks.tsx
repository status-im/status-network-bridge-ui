import Link from "next/link";

type FooterLinksProps = {
  toggleMenu?: () => void;
};

export const FooterLinks = ({ toggleMenu }: FooterLinksProps) => (
  <div className="space-y-2 py-4 text-white">
    <Link
      className="flex items-center hover:text-primary"
      href="https://docs.status.network/privacy-policy"
      passHref
      target="_blank"
      rel="noopener noreferrer"
      onClick={toggleMenu}
    >
      Privacy Policy
    </Link>
    <Link
      className="flex items-center hover:text-primary"
      href="https://docs.status.network/terms-of-use"
      passHref
      target="_blank"
      rel="noopener noreferrer"
      onClick={toggleMenu}
    >
      Terms of service
    </Link>
  </div>
);
