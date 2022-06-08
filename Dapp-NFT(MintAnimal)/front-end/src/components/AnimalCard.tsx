import React, { FC } from "react";
import { Image } from "@chakra-ui/react";

interface AnimalCardProps {
  animalType: string;
}

const AnimalCard: FC<AnimalCardProps> = ({ animalType }) => {
  // AnimalCardProps을 Props로 받는다
  // animalType은 어떤 NFT를 뽑았는지 조회
  return (
    <Image w={100} h={100} src={`images/${animalType}.png`} alt="AnimalCard" />
    // animalType을 통해 NFT조회된걸 이미지로 그대로 출력한다
  );
};

export default AnimalCard;
