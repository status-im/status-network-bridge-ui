import Link from "next/link";
import { Collapse } from "@/components/ui";

export default function FaqPage() {
  return (
    <div className="m-auto min-w-min max-w-5xl">
      <h1 className="mb-6 text-4xl md:hidden">FAQ</h1>
      <div className="flex flex-col gap-5">
        <Collapse title="Which address do the funds go to?">
          <p>By default, your bridged funds are sent to the same address they were originally sent from.</p>
        </Collapse>

        <Collapse title="Can I send the funds to a different address?">
          <p>
            Yes — find the &apos;To different address&apos; button beneath the field that displays the amount of ETH or
            tokens you will receive on the target chain. You can then enter the address you want the funds to be bridged
            to. Only send funds to addresses on Ethereum or Status Network. You may lose funds otherwise, and
            they will be irretrievable (see this{" "}
            <Link
              href="https://support.metamask.io/managing-my-tokens/moving-your-tokens/funds-sent-on-wrong-network/#non-evm-tokens-and-networks"
              rel="noopener noreferrer"
              passHref
              target="_blank"
              className="link link-secondary"
            >
              MetaMask Support article
            </Link>{" "}
            for an explanation). This means you cannot bridge to Bitcoin or Solana, for example, using the Status Network Bridge.
          </p>
        </Collapse>

        <Collapse title="I need to claim a transaction. What do I do?">
          <p>
            If you chose manual claiming, you need to return to the Status Network Bridge and make an additional transaction. It
            typically takes around 20 minutes (two Ethereum epochs) before you can claim a deposit; withdrawals from
            Status Network can take much longer, and vary in duration.
          </p>
          <p>
            To claim, head to the &apos;Transactions&apos; tab and locate the bridge transaction you want to claim; it
            should be marked as &apos;Ready to claim&apos;. Click on it, and then on the &apos;Claim&apos; button to
            initiate the transaction.
          </p>
        </Collapse>

        <Collapse title="Why can I only select Status Network and Ethereum?">
          <p>
            The Status Network Bridge is designed to transact between layer 1 (Ethereum) and layer 2 (Status Network),
            rather than for bridging to any other chains.
          </p>
          <p>
            If you want to bridge to other EVM-compatible networks, consider using the{" "}
            <Link
              href="https://portfolio.metamask.io/bridge"
              rel="noopener noreferrer"
              passHref
              target="_blank"
              className="link link-secondary"
            >
              MetaMask Portfolio bridge
            </Link>
            .
          </p>
        </Collapse>

        <Collapse title="Why can't I see the token I want to bridge?">
          <p>
            The tokens available to select on the Status Network Bridge are sourced from a curated list defined{" "}
            <Link
              href="https://github.com/status-im/status-network-token-list"
              rel="noopener noreferrer"
              passHref
              target="_blank"
              className="link link-secondary"
            >
              here
            </Link>{" "}
            and maintained by the Status Network team. This practice ensures users always bridge to the correct token—rather than
            variants
          </p>
        </Collapse>

        <Collapse title="Why can't I see my bridged tokens in my wallet?">
          <p>
            First, check whether your funds are ready to claim. To see claimable funds, go to the “Transactions” tab of
            the Status Network Bridge app.
          </p>

          <p>
            If the transaction is still pending, just wait for it to be confirmed, and your funds will be available to
            claim or will be in your wallet (depending on the claiming method you chose). If the transaction is missing,
            or it has been confirmed and you still don&pos;t see your tokens, contact support by heading to our moderated{" "}
            <Link
                href="https://t.me/statusl2"
                rel="noopener noreferrer"
                passHref
                target="_blank"
                className="link link-secondary"
            >
              Telegram group
            </Link>
            .
          </p>
            .
        </Collapse>

        <Collapse title="How long does the bridging take?">
          <p>This depends on the direction of your bridge:</p>
          <ul className="list-disc pl-8">
            <li>Deposit (L1 -&gt; L2): Approximately 20 minutes.</li>
            <li>
              Withdrawal (L2 -&gt; L1): Between 8 and 32 hours. The L2 transaction must be finalized on Ethereum
              before you can claim your funds.
            </li>
          </ul>
        </Collapse>

        <Collapse title="Can I speed up my transaction?">
          <p>
            Yes, although it&apos;s not a method we recommend for beginners.
          </p>
          <p>
            Note that this only speeds up your submission of the bridge transaction. It does not actually speed up the
            bridging process itself that you initiate with this transaction — you cannot speed up the 8-32 hour waiting
            time for a withdrawal.
          </p>
        </Collapse>

        <Collapse title="Where can I access support?">
          <p>
            You can get advice and support on our moderated{" "}
            <Link
              href="https://t.me/statusl2"
              rel="noopener noreferrer"
              passHref
              target="_blank"
              className="link link-secondary"
            >
              Telegram group
            </Link>
            .
          </p>
        </Collapse>

        <Collapse title="How can I deposit to main-net of Status Network?">
          <p>
            Status Network is currently in test-net phase and deposits to the main-net instance of the
            network will come later
          </p>
        </Collapse>
      </div>
    </div>
  );
}
