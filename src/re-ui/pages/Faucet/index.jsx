import { Skeleton } from "@material-ui/lab";
import { useEffect, useState, memo } from "react";
import { tw } from "twind";
import DashboardLayout from "../../layouts/dashboard";
import Web3 from "web3";
import { faucet } from "src/abi/faucet";
import toast, { Toaster } from "react-hot-toast";

const tost = () =>
  toast.success("Success.", {
    style: {
      padding: "16px",
      color: "#000",
      marginTop: "75px",
    },
    iconTheme: {
      primary: "#0b0b0b",
      secondary: "#ffffff",
    },
  });

const Faucet = () => {
  useEffect(() => {}, []);

  const getWeb3Inst = async () => {
    return new Web3(window.ethereum);
  };

  const getAccount = async () => {
    const web = await getWeb3Inst();
    const account = await web.eth.getAccounts();
    return account[0];
  };

  const claimbets = async () => {
    try {
      const web = await getWeb3Inst();
      console.log("web", web);
      const contract = new web.eth.Contract(
        [
          {
            inputs: [
              {
                internalType: "address",
                name: "_bets",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            inputs: [],
            name: "bets",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "dispenseBets",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_bets",
                type: "address",
              },
            ],
            name: "setBets",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        "0xA2130d0DbD3F4d7c95f8aBa0b8bA4efc8F23026f"
      );
      console.log("contract", contract);
      const data = await contract.methods
        .dispenseBets("10000000000000")
        .send({ from: await getAccount() });
      if (data.status) {
        tost();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const claimBusd = async () => {
    try {
      const web = await getWeb3Inst();
      console.log("web", web);
      const contract = new web.eth.Contract(
        [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "dispenseBets",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_busd",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_busd",
                type: "address",
              },
            ],
            name: "setBets",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "busd",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        "0xD2Eea0BbF0560999ac7A1Eb11eaBcEa70b4cfc38"
      );
      console.log("contract", contract);
      const data = await contract.methods
        .dispenseBets("1000000000000000000000")
        .send({ from: await getAccount() });
      if (data.status) {
        tost();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <p style={{ textAlign: "center" }}>
        This Faucet lets you claim 10000 BETS and 1000 BUSD to test the platform, Only Once.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "15px",
          height: "80vh",
          alignItems: "center",
        }}
      >
        <button
          className={tw(
            "py-5 bg-white rounded-[10px] flex justify-between items-center px-4 text-[12px] font-extrabold uppercase text-black min-w-[120px] max-w-[250px] max-h-[80px] w-full"
          )}
          onClick={() => claimbets()}
        >
          CLAIM TEST BETS
        </button>
        <button
          className={tw(
            "py-5 bg-white rounded-[10px] flex justify-between items-center px-4 text-[12px] font-extrabold uppercase text-black min-w-[120px] max-w-[250px] max-h-[80px] w-full"
          )}
          onClick={() => claimBusd()}
        >
          CLAIM TEST BUSD
        </button>
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

export default Faucet;
