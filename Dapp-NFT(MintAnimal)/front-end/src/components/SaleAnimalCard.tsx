import React, { FC, useEffect, useState } from "react";
import AnimalCard from "./AnimalCard";
import { Box, Button, Text } from "@chakra-ui/react";
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
  web3,
} from "../contracts";

interface SaleAnimalCardProps {
  animalType: string;
  animalPrice: string;
  animalTokenId: string;
  account: string;
  getOnSaleAnimalToken: () => Promise<void>;
  // getOnSaleAnimalToken 함수를 Props로 받을수 있다
  // async & await 이 없다면 그냥 void 로 써야하지만
  // async & await를 사용한 함수라서 앞에 Promise를 붙여줘야한다
  // ⭐⭐⭐함수에 리턴하는게 없으면 void 타입이다⭐⭐⭐
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
  animalType,
  animalPrice,
  animalTokenId,
  account,
  getOnSaleAnimalToken,
  // Props
  // animalType은 어떤 NFT를 뽑았는지 조회
  // animalPrices는 NFT의 가격을 조회
}) => {
  const [isBuyable, setIsBuyable] = useState<boolean>(false);
  // true와 false 로 나타나는 useState

  const getAnimalTokenOwner = async () => {
    try {
      const res = await mintAnimalTokenContract.methods
        // 스마트컨트랙트 배포후에 나오는 함수
        .ownerOf(animalTokenId)
        // 인자에 NFT의 고유 id를 넣으면 👉 그 NFT를 누가 가지고 있는지 주소를 알려준다
        .call(); // 함수 부르기

      setIsBuyable(res.toLocaleLowerCase() === account.toLocaleLowerCase());
      // res에 담긴 NFT를 누가 가지고 있는지 알려주는 주소랑
      // account에 담겨있는 주소랑 같긴 같은데 대문자가 섞여있어서 false로 출력한다
      // 그래서 toLocaleLowerCase 을 이용하여 대문자를 다 소문자로 바꿔주는 작업을해서 비교한다
      // true === true 👉 true
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = async () => {
    try {
      if (!account) return;
      // 계정이 없는경우는 그냥 리턴

      const res2 = await saleAnimalTokenContract.methods
        // 스마트컨트랙트 배포후에 나오는 함수
        .purchaseAnimalToken(animalTokenId)
        // payable이 들어간 함수 purchaseAnimalToken
        // payable 👉 토큰을 전송하거나 받을때 payable 가 필요하다
        // 인자에 NFT의 고유 id를 넣으면 👉 그 NFT를 누구에게 팔지 send 인자를 입력해야한다
        .send({ from: account, value: animalPrice });
      // 상대방의 주소와, NFT를 얼마에 팔지 입력

      if (res2.status === true) {
        getOnSaleAnimalToken();
      }
      // getOnSaleAnimalToken함수를 실행
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAnimalTokenOwner();
  }, []);

  return (
    <Box textAlign="center" w={100}>
      <AnimalCard animalType={animalType} />
      {/* AnimalCard는 animalType을 통해 NFT조회된걸 이미지로 그대로 출력한다 */}
      <Box>
        <Text display="inline-block">
          {web3.utils.fromWei(animalPrice)} Matic
          {/* web3에서 제공하는 utils에서 fromWei 인데 0이 18개가 붙어서 출력한다
          1 Matic = 1,000,000,000,000,000,000 👉 0이 18개
        0.1 Matic = 100,000,000,000,000,000   👉 0이 17개
        Box에 해당 NFT가격을 나타내준다 0원 이 아닐경우 가격을 표시*/}
        </Text>
        {/* {!isBuyable && (
          <Button size="sm" colorScheme="green" m={2}>
            Buy
          </Button>
        )} */}
        {/* isBuyable 이 true 이면 버튼이 안나오게 */}

        <Button
          size="sm"
          colorScheme="green"
          m={2}
          disabled={isBuyable}
          onClick={onClickBuy}
        >
          Buy
        </Button>
        {/* chakra-ui 의 장점 중 하나 disabled 👉 isBuyable 이 true 이면 클릭버튼 비활성화가 된다*/}
      </Box>
    </Box>
  );
};

export default SaleAnimalCard;
