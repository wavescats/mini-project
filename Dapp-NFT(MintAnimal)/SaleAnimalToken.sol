// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintAnimalToken.sol";

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

    function purchaseAnimalToken(uint256 _animalTokenId) public payable {
        // payable 👉 토큰을 전송하거나 받을때 payable 가 필요하다
        uint256 price = animalTokenPrices[_animalTokenId];
        // mapping을 이용한 값 가져옴
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(
            _animalTokenId
        );
        // 판매할때 사용했던 코드랑 같다

        require(price > 0, "Animal token not sale");
        // 가격이 0 보다 큰경우는 판매 등록이 되었다는 뜻 👉 0보다 크면 다음줄 👉 아니면 에러 문구를 출력
        //--------------------------------------------

        require(price <= msg.value, "Caller sent lower than price");
        // msg.value 👉 송금보낸 코인의 값
        // 판매하는 가격이 송금을 보낼 코인의 값과 같거나 클경우 👉 다음줄 👉 아니면 에러 문구를 출력
        //--------------------------------------------

        require(animalTokenOwner != msg.sender, "Caller is animal token owner");
        // 판매할때랑은 반대로 animalTokenOwner 소유주가 아닌지 확인 👉 소유주가 아니면 다음 👉 소유주면 에러 문구를 출력
        //--------------------------------------------

        payable(animalTokenOwner).transfer(msg.value);
        // transfer 👉 2300 gas를 소비 / 실패시 에러를 발생시킨다
        // animalTokenOwner - NFT 소유주가 코인 송금을 받는다

        mintAnimalTokenAddress.safeTransferFrom(
            animalTokenOwner,
            msg.sender,
            _animalTokenId
        );
        // NFT 소유주에게 코인을 송금 보낸후 내가 NFT를 받는 코드👆
        // ERC-721 내장함수 - safeTransferFrom 👉 받는주소가 NFT를 받을 수 있는지 확인 후 NFT 소유권 전송
        // safeTransferFrom(from보내는사람, to받는사람, tokenId 뭘보낼지);
        //--------------------------------------------

        // 이제 NFT가 팔렸으니 판매자는 판매중인 배열에서 빼야한다 (=초기화 해야한다)
        // 1. mapping에서 제거 하기
        animalTokenPrices[_animalTokenId] = 0;
        // _animalTokenId을 넣어서 가격을 0으로 초기화 시킨다

        // 2. 배열에서 제거하기
        for (uint256 i = 0; i < onSaleAnimalTokenArray.length; i++) {
            // onSaleAnimalTokenArray 배열안에 객체를 하나씩 순회함
            if (animalTokenPrices[onSaleAnimalTokenArray[i]] == 0) {
                // 판매중인 것은 가격이 존재하는데 이미 팔린것은 0원 이기때문에 / 0원짜리를 제거 해줘야한다
                onSaleAnimalTokenArray[i] = onSaleAnimalTokenArray[
                    onSaleAnimalTokenArray.length - 1
                ];
                // 배열을 순회해서 현재 가격이 0원인 객체를 찾으면 👉 배열의 맨뒤로 보낸다 (length - 1)
                onSaleAnimalTokenArray.pop();
                // 배열의 맨뒤로 간 객체를 pop 을 이용해 제거한다
            }
        }
    }

    function getonSaleAnimalTokenArrayLength() public view returns (uint256) {
        // ⭐ view는 읽기전용이라는 뜻
        return onSaleAnimalTokenArray.length;
        // 판매중인 토큰의 배열 목록(길이)
    }

    function getAnimalTokenPrice(uint256 _animalTokenId) view public returns (uint256) {
        return animalTokenPrices[_animalTokenId];
        // mapping 으로 가져온것은 대괄호[]로 인자를 가져와야한다
        // 위에서 정의된 변수 animalTokenId 를 인자로 👉 넣어서 가격을 확인한다

    }
}
