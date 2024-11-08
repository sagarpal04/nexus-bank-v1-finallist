import React, { useEffect } from "react";
import BalanceOverview from "./BalanceOverview";
import TransactionList from "./TransactionList";
import ActionButtons from "./ActionButtons";
import Footer from "./Footer";
import { useState } from "react";
import { ChevronsUp, LogOut } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../useContext/AuthContext";
import axios from "axios";

export default function AccountDetails() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setRemainingTime } = useAuth();
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchData = async (email) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/accountdetails`,
          { params: { email } }
        );

        const response2 = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/transactionshistory`,
          { params: { email } }
        );

        if (response.data) {
          setBalance(response.data.balance);
          setName(response.data.name);
        }

        if (response2.data && response2.data.transactions) {
          setTransactions(response2.data.transactions);
        }

        console.log(response2.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const email = isAuthenticated;
    fetchData(email);
    setLastLogin(new Date().toLocaleString("en-IN"));
  }, [isAuthenticated]);

  const withdrawAmount = transactions
    .filter((transaction) => transaction.type === "WITHDRAWAL")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  const depositAmount = transactions
    .filter((transaction) => transaction.type === "DEPOSIT")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  const IND_CURRENCY_SYMBOL = "₹";
  return (
    <div className="bg-gray-100 flex justify-center min-h-screen">
      <div className="w-9/12 my-12">
        <div className="mb-10 flex items-center justify-between">
          <p className="text-3xl font-medium text-gray-900 ">
            Welcome Back, {name.split(" ")[0]}
          </p>
          <LogOut
            className="cursor-pointer"
            size={30}
            onClick={() => {
              setIsAuthenticated("");
              setRemainingTime(0);
              navigate("/");
            }}
          />
        </div>
        <BalanceOverview
          balance={balance}
          IND_CURRENCY_SYMBOL={IND_CURRENCY_SYMBOL}
          lastLogin={lastLogin}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-14 gap-4">
          <TransactionList transactions={transactions} />
          <ActionButtons
            email={isAuthenticated}
            setTransactions={setTransactions}
            balance={balance}
            setBalance={setBalance}
            name={name}
          />
        </div>
        <Footer withdrawAmount={withdrawAmount} depositAmount={depositAmount} />
      </div>
    </div>
  );
}
