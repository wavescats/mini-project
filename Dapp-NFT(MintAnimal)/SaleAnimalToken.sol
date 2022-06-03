// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "MintAnimalToken.sol";

// MintAnimalToken.sol 파일을 불러옴

contract SaleAnimalToken {
    MintAnimalToken public mintAnimalTokenAddress;

    // MintAnimalToken 을 배포하면 나오는 주소를 👉 mintAnimalTokenAddress에 담는다

    constructor(address _mintAnimalTokenAddress) {
        mintAnimalTokenAddress = MintAnimalToken(_mintAnimalTokenAddress);
    } // constructor 를 이용해 정의

    mapping(uint256 => uint256) public animalTokenPrices;
    // 키값의 타입 => 밸류값의 타입  / 접근제한자 / mapping 이름

    uint256[] public onSaleAnimalTokenArray;

    // uint256 타입의 빈배열 생성
    // 판매 등록하는 함수 생성 👇
    function setForSaleAnimalToken(uint256 _animalTokenId, uint256 _price)
        public
    {
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(
            _animalTokenId
        );
        // ERC-721 내장함수 - ownerOf 👉 특정 TokenId를 가진 NFT의 소유주 주소를 반환한다
        // require 👉 특정한 조건에 부합하지 않으면 에러를 발생시키고 (⭐ false 일 때) / gas를 환불 시켜준다
        //--------------------------------------------

        require(
            animalTokenOwner == msg.sender,
            "Caller is not animal token owner"
        );
        // animalTokenOwner 소유주가 맞는지 확인 👉 맞으면 그 다음줄 👉 아니면 에러 문구를 출력
        // msg.sender 👉 스마트컨트랙트를 사용하는 주체
        //--------------------------------------------

        require(_price > 0, "Price is zero or lower");
        // 가격이 0보다 크면 👉 다음줄로 👉 아니면 에러문구를 출력
        //--------------------------------------------

        require(
            animalTokenPrices[_animalTokenId] == 0,
            "This animal token is already on sale"
        );
        // mapping을 이용한 값
        // _animalTokenId 가격이 0 일경우는 아직 판매 되지 않았다는 뜻 👉 0이면 다음줄 👉 아니면 에러 문구를 출력
        //--------------------------------------------

        require(
            mintAnimalTokenAddress.isApprovedForAll(
                animalTokenOwner,
                address(this)
            ),
            "Animal token owner did not approve token"
        );
        // ERC-721 내장함수 - isApprovedForAll 👉 onwer가 특정계정에게 자신의 모든 NFT에 대한 사용을 허용했는지 여부를 반환
        // address(this)는 setForSaleAnimalToken의 주소이다
        // 판매권한을 줬는지 확인 👉 권한이 있으면 다음 👉 아니면 에러 문구를 출력
        //--------------------------------------------

        animalTokenPrices[_animalTokenId] = _price;
        // mapping을 이용한 값

        onSaleAnimalTokenArray.push(_animalTokenId);
        // 어떤게 판매중인지 확인하는 배열
    }
}
