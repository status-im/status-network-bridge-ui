import Script from "next/script";
import fathomScript from "@/components/fathom/fathom.script";

const Fathom = () => {
  return (
    <>
      <Script id="fathom-script"/>
      <Script id="fathom-injector-script" dangerouslySetInnerHTML={{__html: fathomScript}}/>
    </>
  )
}

export default Fathom