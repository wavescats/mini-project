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
  >(); // StateAnimalCardArray는
  // 👉 SaleCardButton.tsx에서 interface로 정의된 타입을 import해옴

  const getOnSaleAnimalToken = async () => {
    try {
      const onnSaleAnimalTokenArrayLength = await saleAnimalTokenContract.methods
        // 스마트컨트랙트 배포후에 나오는 함수
        .getonSaleAnimalTokenArrayLength()
        // 가격을 입력하고 sell 버튼을 눌러서 가격에 판매중인 토큰의 배열 목록(길이)
        .call(); // 함수 부르기

      const tempOnSaleArray: StateAnimalCardArray[] = [];
      // SaleCardButton.tsx에서 정의한 타입의 빈배열

      // 블록체인 백엔드 부분을 프론트엔드에서 구현하다보니 불러오는 시간이 너무 오래걸려서
      // 원래 이 부분은 SaleAnimalToken.sol 파일로 옮겨야 한다
      // ⭐⭐⭐⭐👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇
      for (let i = 0; i < parseInt(onnSaleAnimalTokenArrayLength, 10); i++) {
        // string 타입이기 때문에 parseInt로 숫자로 형변환을 해준다, 10진수
        // 👉 for문으로 0번부터 순서대로 조회할것이다

        const animalTokenId = await saleAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수
          .onSaleAnimalTokenArray(i)
          .call(); // 함수 부르기

        const animalType = await mintAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수
          .animalTypess(animalTokenId)
          // 어떤 NFT를 뽑았는지 조회 (인자에는 NFT id를 넣는다)
          .call(); // 함수 부르기

        const animalPrice = await saleAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수 👉 이번에는 판매 Contract
          .animalTokenPrices(animalTokenId)
          // 위에서 정의된 변수 animalTokenId 를 인자로 👉 넣어서 가격을 확인한다
          .call(); // 함수 부르기

        tempOnSaleArray.push({ animalTokenId, animalType, animalPrice });
        // 빈배열에 for문으로 돌려서 나온 i 순서대로 animalTokenId를 push한다
        // 👉 animalTokenId 에 맞는 / 위에 변수 animalType과 animalPrice는 자동으로 끌어옴
      }

      satSaleAnimalCardArray(tempOnSaleArray);
      // 버튼을 눌러서 sale-animal 링크로 들어가면
      // 👉 어떤 NFT들을 가지고있는지 NFT 이미지배열을 출력해주는 useState
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOnSaleAnimalToken();
  }, []);
  // 한번만 실행해준다

  return (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {/* 이미지가 나올때마다 그리드 적용 */}
      {saleAnimalCardArray &&
        saleAnimalCardArray.map((value, index) => {
          //  👉 어떤 NFT들을 가지고있는지 NFT 이미지배열을 map 으로 출력한다
          return (
            <SaleAnimalCard
              key={index}
              animalType={value.animalType}
              animalPrice={value.animalPrice}
              animalTokenId={value.animalTokenId}
              account={account}
              getOnSaleAnimalToken={getOnSaleAnimalToken}
              // ⭐⭐⭐함수도 Props 로 내려줄수 있다⭐⭐⭐
            />
          ); // SaleAnimalCard 컴포넌트와 Props를 불러온다
          //배열에서 map으로 걸러낸 value
        })}
    </Grid>
  );
};

export default SaleAnimal;
