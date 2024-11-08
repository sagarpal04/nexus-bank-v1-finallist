import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useContext/AuthContext";
export default function ActionButtons({
  email,
  setTransactions,
  balance,
  name,
  setBalance,
}) {
  const { setIsAuthenticated, setRemainingTime } = useAuth();
  const navigator = useNavigate();
  const [addMoney, setAddMoney] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteEmailPassword, setDeleteEmailPassword] = useState("");

  const [transferToEmail, setTransferToEmail] = useState("");
  const [transferToAmount, setTransferToAmount] = useState("");
  const onSubmitTransfer = async () => {
    try {
      if (Number(addMoney) > Number(balance)) {
        alert("Insufficient balance.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/transfer`,
        {
          email: transferToEmail,
          amount: transferToAmount,
          user: email,
          name: name,
        }
      );
      setTransactions((prev) => [
        ...prev,
        {
          type: "WITHDRAWAL",
          amount: parseFloat(transferToAmount).toFixed(2),
          date: new Date(),
          email: email,
        },
      ]);

      setBalance((prev) => {
        const newBalance = Number(prev) - Number(transferToAmount);
        return parseFloat(newBalance.toFixed(2));
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error transferring money:", error);
      alert("Failed to transfer money. Please try again.");
    } finally {
      setTransferToEmail("");
      setTransferToAmount("");
    }
  };
  const onSubmitDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/deleteaccount`,
        {
          data: {
            email: deleteEmail,
            password: deleteEmailPassword,
            name: name,
          },
        }
      );

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/deleteaccounttransactions`,
        {
          data: {
            email: deleteEmail,
          },
        }
      );
      setIsAuthenticated("");
      setRemainingTime(0);
      setDeleteEmail("");
      setDeleteEmailPassword("");

      navigator("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const onSubmitAddMoney = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/addmoney`,
        {
          email: email,
          amount: addMoney,
          type: "DEPOSIT",
          name: name,
        }
      );
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/updatebalance`, {
        email: email,
        amount: Number(addMoney) + Number(balance),
      });
      setBalance((prev) => {
        const newBalance = Number(prev) + Number(addMoney);
        return parseFloat(newBalance.toFixed(2));
      });

      alert(response.data.message);
      setTransactions((prev) => [
        ...prev,
        {
          type: "DEPOSIT",
          amount: parseFloat(addMoney).toFixed(2),
          date: new Date(),
          email: email,
        },
      ]);

      setAddMoney("");
    } catch (error) {
      console.error("Error adding money:", error);
      alert("Failed to add money. Please try again.");
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {/* Transfer Money Section */}
      <div className="bg-gradient-to-tl from-[#ffb003] to-[#ffcb03] py-7 px-6 md:px-9 rounded-lg flex flex-col">
        <p className="text-lg font-semibold mb-4 text-darkGray">
          Transfer money
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="flex flex-col items-center gap-1 w-full md:w-auto">
            <input
              type="text"
              value={transferToEmail}
              onChange={(e) => setTransferToEmail(e.target.value)}
              className="outline-none bg-white/40 font-inherit text-sm text-center text-black rounded-lg p-2 w-full md:w-auto"
            />
            <label htmlFor="transferTo" className="text-sm">
              Transfer to
            </label>
          </div>
          <div className="flex flex-col items-center gap-1 w-full md:w-auto">
            <input
              type="text"
              value={transferToAmount}
              onChange={(e) => setTransferToAmount(e.target.value)}
              className="outline-none bg-white/40 font-inherit text-sm text-center text-black rounded-lg p-2 w-full md:w-auto"
            />
            <label htmlFor="amount" className="text-sm">
              Amount
            </label>
          </div>
          <button
            onClick={onSubmitTransfer}
            className="text-sm self-stretch md:self-start bg-white px-4 py-1 rounded-lg flex items-center justify-center w-full md:w-auto"
          >
            →
          </button>
        </div>
      </div>

      {/* Add Money Section */}
      <div className="bg-gradient-to-tl-custom py-7 px-6 md:px-9 rounded-lg flex flex-col">
        <p className="text-lg font-semibold mb-4 text-darkGray">Add money</p>
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="flex flex-col items-center gap-1 w-full md:w-auto">
            <input
              type="text"
              name="addMoney"
              id="addMoney"
              value={addMoney}
              onChange={(e) => setAddMoney(e.target.value)}
              className="outline-none bg-white/40 font-inherit text-sm text-center text-black rounded-lg p-2 w-full md:w-auto"
            />
            <label htmlFor="addMoney" className="text-sm">
              Amount
            </label>
          </div>
          <button
            onClick={onSubmitAddMoney}
            className="text-sm self-stretch md:self-start bg-white px-4 py-1 rounded-lg flex items-center justify-center w-full md:w-auto"
          >
            →
          </button>
        </div>
      </div>

      {/* Close Account Section */}
      <div className="bg-gradient-to-tl from-custom-red-1 to-custom-red-2 py-7 px-6 md:px-9 rounded-lg flex flex-col">
        <p className="text-lg font-semibold mb-4 text-darkGray">
          Close account
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="flex flex-col items-center gap-1 w-full md:w-auto">
            <input
              type="text"
              name="confirmUser"
              id="confirmUser"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              className="outline-none bg-white/40 font-inherit text-sm text-center text-black rounded-lg p-2 w-full md:w-auto"
            />
            <label htmlFor="confirmUser" className="text-sm">
              Confirm user
            </label>
          </div>
          <div className="flex flex-col items-center gap-1 w-full md:w-auto">
            <input
              type="text"
              name="confirmPin"
              id="confirmPin"
              value={deleteEmailPassword}
              onChange={(e) => setDeleteEmailPassword(e.target.value)}
              className="outline-none bg-white/40 font-inherit text-sm text-center text-black rounded-lg p-2 w-full md:w-auto"
            />
            <label htmlFor="confirmPin" className="text-sm">
              Confirm PIN
            </label>
          </div>
          <button
            onClick={onSubmitDelete}
            className="text-sm self-stretch md:self-start bg-white px-4 py-1 rounded-lg flex items-center justify-center w-full md:w-auto"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
