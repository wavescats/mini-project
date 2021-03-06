import { Grid } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import SaleAnimalCard from "../components/SaleAnimalCard";
import { StateAnimalCardArray } from "../components/SaleCardButton";
import { mintAnimalTokenContract, saleAnimalTokenContract } from "../contracts";

interface SaleAnimalProps {
  account: string;
}

const SaleAnimal: FC<SaleAnimalProps> = ({ account }) => {
  const [saleAnimalCardArray, satSaleAnimalCardArray] = useState<
    StateAnimalCardArray[]
  >(); // StateAnimalCardArray๋
  // ๐ SaleCardButton.tsx์์ interface๋ก ์ ์๋ ํ์์ importํด์ด

  const getOnSaleAnimalToken = async () => {
    try {
      const onnSaleAnimalTokenArrayLength = await saleAnimalTokenContract.methods
        // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
        .getonSaleAnimalTokenArrayLength()
        // ๊ฐ๊ฒฉ์ ์๋ ฅํ๊ณ  sell ๋ฒํผ์ ๋๋ฌ์ ๊ฐ๊ฒฉ์ ํ๋งค์ค์ธ ํ ํฐ์ ๋ฐฐ์ด ๋ชฉ๋ก(๊ธธ์ด)
        .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ

      const tempOnSaleArray: StateAnimalCardArray[] = [];
      // SaleCardButton.tsx์์ ์ ์ํ ํ์์ ๋น๋ฐฐ์ด

      // ๋ธ๋ก์ฒด์ธ ๋ฐฑ์๋ ๋ถ๋ถ์ ํ๋ก ํธ์๋์์ ๊ตฌํํ๋ค๋ณด๋ ๋ถ๋ฌ์ค๋ ์๊ฐ์ด ๋๋ฌด ์ค๋๊ฑธ๋ ค์
      // ์๋ ์ด ๋ถ๋ถ์ SaleAnimalToken.sol ํ์ผ๋ก ์ฎ๊ฒจ์ผ ํ๋ค
      // โญโญโญโญ๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐
      for (let i = 0; i < parseInt(onnSaleAnimalTokenArrayLength, 10); i++) {
        // string ํ์์ด๊ธฐ ๋๋ฌธ์ parseInt๋ก ์ซ์๋ก ํ๋ณํ์ ํด์ค๋ค, 10์ง์
        // ๐ for๋ฌธ์ผ๋ก 0๋ฒ๋ถํฐ ์์๋๋ก ์กฐํํ ๊ฒ์ด๋ค

        const animalTokenId = await saleAnimalTokenContract.methods
          // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
          .onSaleAnimalTokenArray(i)
          .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ

        const animalType = await mintAnimalTokenContract.methods
          // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์
          .animalTypess(animalTokenId)
          // ์ด๋ค NFT๋ฅผ ๋ฝ์๋์ง ์กฐํ (์ธ์์๋ NFT id๋ฅผ ๋ฃ๋๋ค)
          .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ

        const animalPrice = await saleAnimalTokenContract.methods
          // ์ค๋งํธ์ปจํธ๋ํธ ๋ฐฐํฌํ์ ๋์ค๋ ํจ์ ๐ ์ด๋ฒ์๋ ํ๋งค Contract
          .animalTokenPrices(animalTokenId)
          // ์์์ ์ ์๋ ๋ณ์ animalTokenId ๋ฅผ ์ธ์๋ก ๐ ๋ฃ์ด์ ๊ฐ๊ฒฉ์ ํ์ธํ๋ค
          .call(); // ํจ์ ๋ถ๋ฅด๊ธฐ

        tempOnSaleArray.push({ animalTokenId, animalType, animalPrice });
        // ๋น๋ฐฐ์ด์ for๋ฌธ์ผ๋ก ๋๋ ค์ ๋์จ i ์์๋๋ก animalTokenId๋ฅผ pushํ๋ค
        // ๐ animalTokenId ์ ๋ง๋ / ์์ ๋ณ์ animalType๊ณผ animalPrice๋ ์๋์ผ๋ก ๋์ด์ด
      }

      satSaleAnimalCardArray(tempOnSaleArray);
      // ๋ฒํผ์ ๋๋ฌ์ sale-animal ๋งํฌ๋ก ๋ค์ด๊ฐ๋ฉด
      // ๐ ์ด๋ค NFT๋ค์ ๊ฐ์ง๊ณ ์๋์ง NFT ์ด๋ฏธ์ง๋ฐฐ์ด์ ์ถ๋ ฅํด์ฃผ๋ useState
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOnSaleAnimalToken();
  }, []);
  // ํ๋ฒ๋ง ์คํํด์ค๋ค

  return (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {/* ์ด๋ฏธ์ง๊ฐ ๋์ฌ๋๋ง๋ค ๊ทธ๋ฆฌ๋ ์ ์ฉ */}
      {saleAnimalCardArray &&
        saleAnimalCardArray.map((value, index) => {
          //  ๐ ์ด๋ค NFT๋ค์ ๊ฐ์ง๊ณ ์๋์ง NFT ์ด๋ฏธ์ง๋ฐฐ์ด์ map ์ผ๋ก ์ถ๋ ฅํ๋ค
          return (
            <SaleAnimalCard
              key={index}
              animalType={value.animalType}
              animalPrice={value.animalPrice}
              animalTokenId={value.animalTokenId}
              account={account}
              getOnSaleAnimalToken={getOnSaleAnimalToken}
              // โญโญโญํจ์๋ Props ๋ก ๋ด๋ ค์ค์ ์๋คโญโญโญ
            />
          ); // SaleAnimalCard ์ปดํฌ๋ํธ์ Props๋ฅผ ๋ถ๋ฌ์จ๋ค
          //๋ฐฐ์ด์์ map์ผ๋ก ๊ฑธ๋ฌ๋ธ value
        })}
    </Grid>
  );
};

export default SaleAnimal;
