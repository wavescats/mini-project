import React, { FC, useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../contracts";
import AnimalCard from "../components/AnimalCard";

interface MainProps {
  account: string;
}
// TypeScript 는 Props의 타입을 정해줘야한다

const Main: FC<MainProps> = ({ account }) => {
  // 타입을 정해줬으니 Props를 사용
  const [newAnimalType, setNewAnimalType] = useState<string>();

  const onClickMint = async () => {
    try {
      if (!account) return; // 계정이 없는경우는 그냥 리턴

      const response = await mintAnimalTokenContract.methods
        // 변수에 담는건 스마트컨트랙트 배포한 후에 나오는 함수를
        .mintAnimalToken() // 인자 입력없이 이 함수를 클릭하면 민트가 되는 함수였다
        .send({ from: account }); // 누구로 부터 왔는지 계정확인

      console.log(response); // 👉 민트를 하면 트랙잭션에 콘솔에 찍힌다

      if (response.status === true) {
        // 민트 후에 status가 true 일 경우
        const balanceLength = await mintAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수
          .balanceOf(account) // NFT 가지고 있는 갯수 조회 (인자에는 주소를 넣어야한다)
          .call(); // 함수 부르기

        const animalTokenId = await mintAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수
          .tokenOfOwnerByIndex(account, parseInt(balanceLength, 10) - 32)
          // NFT의 Id 값을 조회 (인자는 주소와, 조회하려는 배열순번)
          // length - 1 은 배열의 마지막을 불러온다는 뜻
          // 현재 준비된 이미지가 5개밖에 없어서 민팅된 수량에 따라 조절해주면된다 -30
          // string 타입이기 때문에 parseInt로 숫자로 형변환을 해준다, 10진수
          .call(); // 함수 부르기
        console.log(animalTokenId);
        const animalType = await mintAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수
          .animalTypess(animalTokenId)
          // 어떤 NFT를 뽑았는지 조회 (인자에는 NFT id를 넣는다)
          .call(); // 함수 부르기
        console.log(animalType);
        setNewAnimalType(animalType);
        // 최종적으로는 mint를 하면 👉 어떤 NFT가 뽑혔는지 NFT 이미지를 출력해주는 useState
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      w="full"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      {/* CSS와 비슷한 개념인 코드 센터로 맞추고 / column으로 세로 방향 정렬*/}

      <Box>
        {/* AnimalCard 컴포넌트 Props로 👉 newAnimalType를 불러오는데
      mint를 하면 👉 어떤 NFT가 뽑혔는지 NFT 이미지를 출력해주는 useState 이다 */}
        {newAnimalType ? (
          <AnimalCard animalType={newAnimalType} />
        ) : (
          <Text>Let's mint Animal Card!!!</Text>
        )}
        {/* 3항 연산자 */}
      </Box>
      <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>
        Mint
      </Button>
    </Flex>
  );
};

export default Main;
