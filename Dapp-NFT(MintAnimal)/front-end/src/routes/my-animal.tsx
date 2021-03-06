import { Button, Grid, Text, Box, Flex } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import SaleCardButton, {
  StateAnimalCardArray,
} from "../components/SaleCardButton";
import {
  mintAnimalTokenContract,
  saleAnimalTokenAddress,
  saleAnimalTokenContract,
} from "../contracts/index";

interface MyAnimalProps {
  account: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<
    StateAnimalCardArray[]
  >();
  // ๐ SaleCardButton.tsx์์ interface๋ก ์ ์๋ ํ์์ importํด์ด
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const getAnimalTokens = async () => {
    try {
      const balanceLength2 = await mintAnimalTokenContract.methods
        // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
        .balanceOf(account) // NFT ๊ฐ์ง๊ณ  ์๋ ๊ฐฏ์ ์กฐํ (์ธ์์๋ ์ฃผ์๋ฅผ ๋ฃ์ด์ผํ๋ค)
        .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ

      if (balanceLength2 == 0) return;
      // NFT ๊ฐ 0 ์ผ ๊ฒฝ์ฐ ์คํ ํ์ง๋ง๋ผ

      const tempAnimalCardArray: StateAnimalCardArray[] = [];
      // SaleCardButton.tsx์์ ์ ์ํ ํ์์ ๋น๋ฐฐ์ด

      const response = await mintAnimalTokenContract.methods
        // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
        .apiAnimalToken(account)
        // ๐๐๐ ๋ฐ์ ์ฃผ์์ฒ๋ฆฌ๋ ๋ถ๋ถ์ MintAnimalToken.sol ์์ ๋ค ๋ด์ ํจ์
        .call();

      response.map((value: StateAnimalCardArray) => {
        // apiAnimalToken ํจ์๋ก ๋ถํฐ ๋์ค๋ value๊ฐ์ mapํด์จ๋ค
        tempAnimalCardArray.push({
          animalTokenId: value.animalTokenId,
          animalType: value.animalType,
          animalPrice: value.animalPrice,
        });
      });
      // tempAnimalCardArray๋ฐฐ์ด์ push

      console.log(tempAnimalCardArray);

      // ๋ธ๋ก์ฒด์ธ ๋ฐฑ์๋ ๋ถ๋ถ์ ํ๋ก ํธ์๋์์ ๊ตฌํํ๋ค๋ณด๋ ๋ถ๋ฌ์ค๋ ์๊ฐ์ด ๋๋ฌด ์ค๋๊ฑธ๋ ค์
      // ์ด ๋ถ๋ถ์ MintAnimalToken.sol ํ์ผ๋ก ์ฎ๊ฒจ๊ฐ
      // โญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญ
      // for (let i = 0; i < parseInt(balanceLength2, 10); i++) {
      //   // string ํ์์ด๊ธฐ ๋๋ฌธ์ parseInt๋ก ์ซ์๋ก ํ๋ณํ์ ํด์ค๋ค, 10์ง์
      //   // main.tsx์์๋ ์ต๊ทผ์์๋๋ก ์กฐํํ์ผ๋ (๋ฐฐ์ด์ ๋งจ ๋ง์ง๋ง length - 1)
      //   // ๐ ์ด๋ฒ์๋ for๋ฌธ์ผ๋ก 0๋ฒ๋ถํฐ ์์๋๋ก ์กฐํํ ๊ฒ์ด๋ค

      //   const animalTokenId = await mintAnimalTokenContract.methods
      //     // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
      //     .tokenOfOwnerByIndex(account, i)
      //     // NFT์ Id ๊ฐ์ ์กฐํ (์ธ์๋ ์ฃผ์์, ์กฐํํ๋ ค๋ ๋ฐฐ์ด์๋ฒ)
      //     // ๐ for๋ฌธ์ผ๋ก ๋๋ ค์ ๋์จ i ๊ฐ์ ์ธ์๋ก ๋ฃ์ด์ค๋ค
      //     .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ

      //   const animalType = await mintAnimalTokenContract.methods
      //     // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
      //     .animalTypess(animalTokenId)
      //     // ์ด๋ค NFT๋ฅผ ๋ฝ์๋์ง ์กฐํ (์ธ์์๋ NFT id๋ฅผ ๋ฃ๋๋ค)
      //     .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ
      //   //---------------------------------------------------
      //   const animalPrice = await saleAnimalTokenContract.methods
      //     // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์ ๐ ์ด๋ฒ์๋ ํ๋งค Contract
      //     .animalTokenPrices(animalTokenId)
      //     // ์์์ ์ ์๋ ๋ณ์ animalTokenId ๋ฅผ ์ธ์๋ก ๐ ๋ฃ์ด์ ๊ฐ๊ฒฉ์ ํ์ธํ๋ค
      //     .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ
      //   //---------------------------------------------------
      //   tempAnimalCardArray.push({ animalTokenId, animalType, animalPrice });
      //   // ๋น๋ฐฐ์ด์ for๋ฌธ์ผ๋ก ๋๋ ค์ ๋์จ i ์์๋๋ก animalTokenId๋ฅผ pushํ๋ค
      //   // ๐ animalTokenId ์ ๋ง๋ / ์์ ๋ณ์ animalType๊ณผ animalPrice๋ ์๋์ผ๋ก ๋์ด์ด
      // } โญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญโญ

      setAnimalCardArray(tempAnimalCardArray);
      // ๋ฒํผ์ ๋๋ฌ์ my-animal ๋งํฌ๋ก ๋ค์ด๊ฐ๋ฉด ๐ ์ด๋ค NFT๋ค์ด ๋ฝํ๋์ง NFT ์ด๋ฏธ์ง๋ฐฐ์ด์ ์ถ๋ ฅํด์ฃผ๋ useState
    } catch (error) {
      console.error(error);
    }
  };

  const getApprovedForAllCall = async () => {
    // onwer๊ฐ ํน์ ๊ณ์ ์๊ฒ ์์ ์ ๋ชจ๋  NFT์ ๋ํ ์ฌ์ฉ์ ํ์ฉํ๋์ง ์ฌ๋ถ๋ฅผ ํ์ธํ๋ ๋ณ์
    try {
      const res = await mintAnimalTokenContract.methods
        // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
        .isApprovedForAll(account, saleAnimalTokenAddress)
        // ERC-721 ๋ด์ฅํจ์ - isApprovedForAll ๐ onwer๊ฐ ํน์ ๊ณ์ ์๊ฒ ์์ ์ ๋ชจ๋  NFT์ ๋ํ ์ฌ์ฉ์ ํ์ฉํ๋์ง ์ฌ๋ถ๋ฅผ ๋ฐํ
        // ํ๋งค๊ถํ์ ์คฌ๋์ง ํ์ธ
        .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ

      if (res === true) {
        // res ๋ณ์๊ฐ true ์ผ๊ฒฝ์ฐ๋
        setSaleStatus(res);
        // useState ๊ธฐ๋ณธ๊ฐ์ false ์ด๋ res๋ฅผ ๋ด์์ค์ผ๋ก์จ true๋ก ์๋ ๋ณ๊ฒฝ
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return; // ๊ณ์ ์ด ์๋๊ฒฝ์ฐ๋ ๊ทธ๋ฅ ๋ฆฌํด

      const res = await mintAnimalTokenContract.methods
        .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        // ์ธ์๋ ํ๋งค์์ ์ฃผ์์, true & false ์ ์ํ
        // !saleStatus์ด๋ฉด ๊ธฐ๋ณธ๊ฐ์ด false๋๊น ๊ทธ ๋ฐ๋์ธ true ๋ผ๋ ๋ป์ด๋ค
        // ๐ ์ฆ, ํ๋งค์์๊ฒ true (ํ์ฉ) ํด์ฃผ๋ผ๋ ๋ป์ด๋ค
        // ERC-721 ๋ด์ฅํจ์ - setApprovalForAll ๐ ํน์ ๊ณ์ ์๊ฒ ์์ ์ด ์์ ํ ๋ชจ๋  NFT์ ๋ํ ์ฌ์ฉ์ ํ์ฉํด์ฃผ๋ ํจ์
        // false๋ฅผ ๐ true ๋ก ํ์ฉํด์ค๋ค
        .send({ from: account }); // account ์ผ๋ก๋ถํฐ ํจ์ ๋ณด๋ด์ฃผ๊ธฐ

      if (res.status) {
        // res ์ ์ํ๊ฐ true ์ด๊ฑฐ๋ false ์ด๋ฉด
        setSaleStatus(!saleStatus);
        // set useState์์ useState๋ฅผ ๋ฃ์์ผ๋ก์จ
        // ๋ฒํผ์ ํด๋ฆญํ ๋๋ง๋ค true <ใก> false ๊ณ์ ๋ณ๊ฒฝ๋๋ค
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;
    // ๋งจ์ฒ์ useEffect๊ฐ ์คํ๋๋ฉด account๋ ์๊ธฐ๋๋ฌธ์ ์๋ฌ๊ฐ ๋ฐ๊ฒ์ด๋ค
    // ๊ทธ๋์ if ๋ฌธ์ ํ๋ ์์ฑํด์ผํ๋ค
    // ๐ account๊ฐ ์์๊ฒฝ์ฐ๋ ๊ทธ๋ฅ ๋ฆฌํด

    getApprovedForAllCall();
    getAnimalTokens();
  }, [account]);

  return (
    <React.Fragment>
      <Flex alignItems="center">
        <Text display="inline-block">
          Sale Status : {saleStatus ? "True" : "False"}
          {/* 3ํญ์ฐ์ฐ์ ๐ useState ๊ฐ์ด ์ฐธ์ด๋ฉด "True" ๊ฑฐ์ง์ด๋ฉด "False"๋ฅผ ์ถ๋ ฅ*/}
        </Text>
        <Button
          size="xs"
          marginLeft="2"
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickApproveToggle}
        >
          {/* ์ผํฐ์๋ฆฌ์ Text์ ๋ฒํผ์ ํ์ค๋ก ๋ง๋ค๊ณ  ๋ฒํผ์์ ์ ์ฉ */}
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(10, 1fr)" gap={5} marginTop={4}>
        {/* Grid(๊ฒฉ์) ํ์ค์ 10๊ฐ์ฉ ๋ฐฐ์ด, ๊ฐญ์ 5๋ก ์ค๋ค */}
        {/* โญ animalCardArray๋ NFT๊ฐ ๋ด๊ฒจ์๋ ๋ฐฐ์ด์ด๋ค 
      animalCardArray๊ฐ ์๋ค๋ฉด map์ ํ๋ค 
      โญ map ํจ์๋ ๋ฐฐ์ด ์์์ ์ํ๋ ๊ฒ๋ง ๋นผ๋ด์ ์ถ๋ ฅ์ด ๊ฐ๋ฅํ๋ค.*/}
        {animalCardArray &&
          animalCardArray.map((value, index) => {
            // map ๐ ์ด๋ค NFT (value) , ๋ช๋ฒ์งธ (index)
            return (
              <SaleCardButton
                key={index}
                animalTokenId={value.animalTokenId}
                animalType={value.animalType}
                animalPrice={value.animalPrice}
                saleStatus={saleStatus}
                account={account}
                // ๐ SaleCardButton.tsx ์์ ๊ฐ์ ธ์จ Props ๋ก ๊ฐ์ ธ์จ ์ธ์๋ค = ์์ ์ ์๋ ๋ณ์
              />
            );
            // ๐ value : ๋ฐฐ์ด ๋ด ํ์ฌ ๊ฐ (string)
            // ๐ index : ๋ฐฐ์ด ๋ด ํ์ฌ ๊ฐ์ ์ธ๋ฑ์ค (์๋ฒ)
          })}
      </Grid>
    </React.Fragment>
  );
};

export default MyAnimal;
