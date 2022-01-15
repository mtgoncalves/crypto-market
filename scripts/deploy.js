const hre = require("hardhat");

async function main() {
  /* Deploy ERC20Token */
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy();
  await erc20Token.deployed();
  console.log("Token deployed to:", erc20Token.address);

  /* Deploy CryptoMarket */
  const CryptoMarket = await hre.ethers.getContractFactory("CryptoMarket");
  const cryptoMarket = await CryptoMarket.deploy(erc20Token.address);
  await cryptoMarket.deployed();
  console.log("cryptoMarket deployed to:", cryptoMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
