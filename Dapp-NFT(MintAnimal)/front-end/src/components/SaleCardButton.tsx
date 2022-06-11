import React, { ChangeEvent, FC, useState } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import AnimalCard from "./AnimalCard";
import { saleAnimalTokenContract, web3 } from "../contracts";

export interface StateAnimalCardArray {
  animalTokenId: string;
  animalType: string;
  animalPrice: string;
} // TypeScript 는 Props의 타입을 정해줘야한다
// ⭐ export ⭐를 써서 my-animal.tsx 에서 불러온다

interface SaleCardButtonProps extends StateAnimalCardArray {
  saleStatus: boolean;
  account: string;
}
// useStateAnimalCardArray 를 상속받아오고
// saleStatus, account 는 타입 정의

const SaleCardButton: FC<SaleCardButtonProps> = ({
  animalTokenId,
  animalType,
  animalPrice,
  saleStatus,
  account,
}) => {
  // SaleCardButtonProps Props로 받는다
  // animalType은 어떤 NFT를 뽑았는지 조회
  // 위에서 interface로 정의된 타입을 👉 Props로 받아옴

  const [sellPrice, setSellPrice] = useState<string>("");
  // 판매중인 가격을 👉 useState로 👉 기본값은 일단 빈값 (밑에서 e.target.value 로 가격은 담아온다)

  const [refreshAnimalPrice, setRefreshAnimalPrice] = useState<string>(
    animalPrice
  );
  // 판매할 가격을 입력할때마다 새로고침을 할수 없기때문에 useState를 만들어준다
  // animalPrice을 useState에 담아버린다

  const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setSellPrice(e.target.value);
  };
  // Input칸에 입력하는 키 하나하나를 👉 가격으로 그대로 기록해서 useState에 담는다

  const onClickSell = async () => {
    try {
      if (!account || !saleStatus) return;
      // account가 없거나 saleStatus이 false 일경우 실행하지말고 리턴
      // 👉 어차피 실행이 안될꺼니까 그냥 리턴해버리라는 뜻

      const res = await saleAnimalTokenContract.methods
        // 스마트컨트랙트 배포후에 나오는 함수
        .setForSaleAnimalToken(
          animalTokenId,
          web3.utils.toWei(sellPrice, "ether")
        ) // 👉 밑에서 fromWei 로 받고 있기때문에 👉 누구에게 보내는지 toWei 를 적는다
        // useState 기본값인 sellPrice
        // 👉사용하는 단위는 Matic 이어도 "ether" 이라고 기재해줘야 한다
        .send({ from: account }); // 누구로 부터 왔는지 계정확인

      if (res.status == true) {
        // res 변수의 상태가 true 일경우
        setRefreshAnimalPrice(web3.utils.toWei(sellPrice, "ether")); // web3설명은 위랑 동일함
      } // 판매할 가격을 입력할때마다 새로고침을 할수 없기때문에 useState에 담아버린다
      //  👉 e.target.value로 useState에 담아온 sellPrice를
      //  👉 새로고침을 할 필요없이 useState에 또 담아버린다
      // useState로 생성된 가격을 👉 또다른 useState에 담음
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box textAlign="center" w={120}>
      <AnimalCard animalType={animalType} />
      <Box marginTop={2}>
        {refreshAnimalPrice == "0" ? (
          <React.Fragment>
            <InputGroup>
              <Input
                type="number"
                value={sellPrice}
                onChange={onChangeSellPrice}
                // Input 입력칸은 숫자만 입력가능
                // useState 기본값인 sellPrice
                // Input 입력하는 키 하나하나를 onChange으로 가져온다
              />
              <InputRightAddon
                children="Matic"
                // 입력할수 있는 Input 옆에 상속받는다는 개념 (children) 기본으로 써있는 글귀 "Matic"
              />
            </InputGroup>
            <Button
              size="sm"
              colorScheme="green"
              marginTop={2}
              onClick={onClickSell}
              // onClick 함수를 그대로 가져오고
              // 버튼 디자인 CSS 적용
            >
              Sell
            </Button>
          </React.Fragment>
        ) : (
          <Text display="inline-block">
            {web3.utils.fromWei(refreshAnimalPrice)} Matic
          </Text>
        )}
        {/* web3에서 제공하는 utils에서 fromWei 인데 0이 18개가 붙어서 출력한다
          1 Matic = 1,000,000,000,000,000,000 👉 0이 18개
        0.1 Matic = 100,000,000,000,000,000   👉 0이 17개
        Box에 해당 NFT가격을 나타내준다 0원 이 아닐경우 가격을 표시*/}
      </Box>
    </Box>
  );
}; // animalType을 통해 NFT조회된걸 이미지로 그대로 출력한다
// ⭐animalType⭐은 MintAnimalToken.sol 파일로 부터 불러옴⭐⭐⭐⭐⭐

// 👉 AnimalCard 컴포넌트를 가져온다

export default SaleCardButton;
