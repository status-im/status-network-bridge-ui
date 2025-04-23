import Script from "next/script";

const Umami = () => {
  return (
    <Script
      defer
      src="https://umami.bi.status.im/script.js"
      data-website-id="96a6fed9-77cb-44e8-8aa4-38123e8a62ba"
      data-domains="bridge.status.network"
    />
  );
};

export default Umami;
