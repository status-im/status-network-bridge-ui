export const generateRPCBasicAuthToken = () => {
  const username = process.env.NEXT_PUBLIC_ETH_RPC_PROXY_USER;
  const password = process.env.NEXT_PUBLIC_ETH_RPC_PROXY_PASS;
  const data = `${username}:${password}`;

  return Buffer.from(data).toString('base64');
}