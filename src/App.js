import { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Divider,
  InputBase,
  Paper,
} from "@mui/material";
import { ethers } from "ethers";
import ERC20Token from "./artifacts/contracts/ERC20Token.sol/ERC20Token.json";
import CryptoMarket from "./artifacts/contracts/CryptoMarket.sol/CryptoMarket.json";

const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const contractAddress = process.env.REACT_APP_CRYPTO_MARKET_ADDRESS;

function App() {
  const [amountToBuy, setAmountToBuy] = useState(0);
  const [amountToSell, setAmountToSell] = useState(0);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);

  getAccount();
  getBalance();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getAccount() {
    if (typeof window.ethereum !== "underfined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(account);
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "underfined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        CryptoMarket.abi,
        provider
      );
      const balance = await contract.getBalance();
      setBalance(balance.toString());
    }
  }

  async function buyTokens() {
    if (typeof window.ethereum !== "undefined") {
      if (amountToBuy <= 0) return;

      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenSigner = provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20Token.abi,
        tokenSigner
      );
      const tokenTrx = await tokenContract.increaseAllowance(
        contractAddress,
        amountToBuy
      );
      await tokenTrx.wait();

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        CryptoMarket.abi,
        signer
      );
      const trx = await contract.buyTokens(amountToBuy);
      await trx.wait();
      setAmountToBuy(0);
    }
  }

  async function sellTokens() {
    if (typeof window.ethereum !== "undefined") {
      if (amountToSell <= 0) return;

      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        CryptoMarket.abi,
        signer
      );
      const trx = await contract.sellTokens(amountToSell);
      await trx.wait();
      setAmountToSell(0);
    }
  }

  return (
    <Grid container>
      <Grid item container xs={4}></Grid>
      <Grid item container xs={4}>
        <Grid xs={12} item sx={{ textAlign: "center", paddingBottom: "10px" }}>
          <h1>CryptoMarket</h1>
        </Grid>
        <Grid xs={12} item>
          <Typography style={{ fontWeight: 600, fontSize: 12 }}>
            Account: {account}
          </Typography>
        </Grid>
        <Grid xs={12} item sx={{ paddingBottom: "20px" }}>
          <Typography style={{ fontWeight: 600, fontSize: 12 }}>
            Balance: {balance}
          </Typography>
        </Grid>
        <Grid xs={12} item sx={{ paddingBottom: "6px" }}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buy tokens"
              inputProps={{ "aria-label": "buy tokens" }}
              onChange={(e) => setAmountToBuy(e.target.value)}
              value={amountToBuy}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="buy"
              onClick={buyTokens}
            >
              <Typography fontSize={15}> Buy tokens </Typography>
            </IconButton>
          </Paper>
        </Grid>
        <Grid xs={12} item>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Sell tokens"
              inputProps={{ "aria-label": "sell tokens" }}
              onChange={(e) => setAmountToSell(e.target.value)}
              value={amountToSell}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="sell"
              onClick={sellTokens}
            >
              <Typography fontSize={15}> Sell tokens </Typography>
            </IconButton>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
