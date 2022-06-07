import React, { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./routes/main";
import MyAnimal from "./routes/my-animal";

const App: FC = () => {
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      // 👉 try 문 안의 코드가 쭉 실행되고 에러가 없다면 catch는 건너뛴다
      if (window.ethereum) {
        // if 👉 메타마스크가 설치되어있으면 실행된다
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }); // 연결된 메타마스크의 주소가 나온다
        // 👉 window.ethereum.request 을 console.log에 찍어보면 확인할수 있다

        setAccount(accounts[0]);
        // 연결된 메타마스크의 주소를 useState에 담는다
      } else {
        // 메타마스크가 설치되어있지 않다면 👉 alert 문구가 나온다
        alert("Install Metamask!");
      }
    } catch (error) {
      // 에러가 발생한다면 catch 실행
      console.error(error); // 👉 에러가 발생했다고 출력
    }
  };

  useEffect(() => {
    getAccount(); // getAccount 한번만 실행
  }, [account]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main account={account} />} />
          <Route path="my-animal" element={<MyAnimal account={account} />} />
          {/* path는 http://localhost:3000/my-animal 라는 뜻 / account는 👉 나의 메타마스크 주소*/}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
