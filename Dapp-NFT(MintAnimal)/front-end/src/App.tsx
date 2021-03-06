import React, { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./routes/main";
import MyAnimal from "./routes/my-animal";
import SaleAnimal from "./routes/sale-animal";

const App: FC = () => {
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      // π try λ¬Έ μμ μ½λκ° μ­ μ€νλκ³  μλ¬κ° μλ€λ©΄ catchλ κ±΄λλ΄λ€
      if (window.ethereum) {
        // if π λ©νλ§μ€ν¬κ° μ€μΉλμ΄μμΌλ©΄ μ€νλλ€
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }); // μ°κ²°λ λ©νλ§μ€ν¬μ μ£Όμκ° λμ¨λ€
        // π window.ethereum.request μ console.logμ μ°μ΄λ³΄λ©΄ νμΈν μ μλ€

        setAccount(accounts[0]);
        // μ°κ²°λ λ©νλ§μ€ν¬μ μ£Όμλ₯Ό useStateμ λ΄λλ€
      } else {
        // λ©νλ§μ€ν¬κ° μ€μΉλμ΄μμ§ μλ€λ©΄ π alert λ¬Έκ΅¬κ° λμ¨λ€
        alert("Install Metamask!");
      }
    } catch (error) {
      // μλ¬κ° λ°μνλ€λ©΄ catch μ€ν
      console.error(error); // π μλ¬κ° λ°μνλ€κ³  μΆλ ₯
    }
  };

  useEffect(() => {
    getAccount(); // getAccount νλ²λ§ μ€ν
  }, [account]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main account={account} />} />
          <Route path="my-animal" element={<MyAnimal account={account} />} />
          {/* pathλ http://localhost:3000/my-animal λΌλ λ» / accountλ π λμ λ©νλ§μ€ν¬ μ£Όμ*/}
          <Route
            path="sale-animal"
            element={<SaleAnimal account={account} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
