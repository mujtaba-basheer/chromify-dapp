import { getBlockchainRid } from "./utils";

export const chromiaClientConfig = {
  blockchainRid:
    "08D67ECB6277A58A0A95F8515D95FB7101966EE411A59A53F56D83EE0804E632",
  directoryNodeUrlPool: [
    "https://node0.projectnet.chromia.dev:7740",
    "https://node1.projectnet.chromia.dev:7740",
    "https://node2.projectnet.chromia.dev:7740",
    "https://node3.projectnet.chromia.dev:7740",
  ],
};

export const getChromiaClientDevConfig = async () => ({
  blockchainRid: await getBlockchainRid(),
  nodeUrlPool: "http://localhost:7740",
});
