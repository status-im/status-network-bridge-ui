export const generateRPCBasicAuthToken = () => {
    const username = process.env.NEXT_PUBLIC_ETH_RPC_PROXY_USER;
    const password = process.env.NEXT_PUBLIC_ETH_RPC_PROXY_PASS;
    const data = `${username}:${password}`;

  return Buffer.from(data).toString('base64');
}

// Auth mode check
export const isPuzzleAuthEnabled = () =>
  process.env.NEXT_PUBLIC_USE_PUZZLE_AUTH === 'true';

