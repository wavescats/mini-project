// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./SaleAnimalToken.sol";

// 👆 원래는 contract밑에 SaleAnimalToken를 정의해 줘야하나
// 시간상으로는 MintAnimalToken안에서 SaleAnimalToken이 먼저 존재 할수 없기 때문에
// import로 .sol 파일 자체를 불러온다

contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("wave", "WAV") {}
    // 이름과 심볼 설정

    SaleAnimalToken public saleAnimalToken;
    // 👆 위에서 import로 불러온 SaleAnimalToken를 이제 정의할수 있다
    // SaleAnimalToken 을 배포하면 나오는 주소를 👉 (s가 소문자) saleAnimalToken 담는다

    mapping(uint256 => uint256) public animalTypess;
    // 키값의 타입 => 밸류값의 타입  / 접근제한자 / mapping 이름

    struct AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
        uint256 animalPrice;
    }// struct로 AnimalTokenData이라는 타입을 정의 해줌으로써 
     // AnimalTokenData타입의 배열을 만들수 있다

    function mintAnimalToken() public {
        uint256 animalTokenId = totalSupply() + 1;
        // 총 공급량 + 1씩 증가

        // 솔리디티에서 랜덤한 값을 뽑아내는 법 👇
        uint256 animalType = (uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, animalTokenId)
            )
        ) % 5) + 1;
        // keccak256을 통해 랜덤한 uint256 타입인  JSON 형식의 인터페이스를 만든다 (실행한 시간, 누가 실행하는지, nft를)
        // % 5 하면 0부터 4까지의 값이 (0 ~ 4) 나오는데 거기에 +1을 하면 1부터 5까지의 값이 (1 ~ 5) 나온다

        animalTypess[animalTokenId] = animalType;
        // 1 ~ 5번 까지의 값이 민팅할 _mint에 들어간다

        _mint(msg.sender, animalTokenId);
        // msg.sender 👉 스마트컨트랙트를 사용하는 주체
        // 민팅 할때마다 animalTokenId + 1
    }

    function apiAnimalToken(address _animalTokenOwner) view public returns (AnimalTokenData[] memory) {
        // struct로 AnimalTokenData이라는 타입을 정의 해줌으로써 👉 AnimalTokenData타입의 배열을 만들수 있다
        // memory   👉 함수의 파라미터 / 리턴값 / 레퍼런스 타입이 저장된다
        //              영속적으로 저장되지는 않고 / 함수 내에서만 유효하다 / 가스비용이 싸다
        //--------------------------------------------
        uint256 balanceLength2 = balanceOf(_animalTokenOwner);
        // balanceOf는 👉 NFT 가지고있는 갯수 조회 (인자에는 주소를 넣어야한다)

        require (balanceLength2 != 0, "Owner did not have token");
        // 에러핸들러 require 👉 특정한 조건에 부합하지 않으면 에러를 발생시키고 (⭐ false 일 때) / gas를 환불 시켜준다
        // balanceLength2 가 0이 아니면 👉 다음줄 👉 0이면 NFT가 한개도 없다는 뜻이므로 문구를 출력한다

        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](balanceLength2);
        // struct로 정의된 AnimalTokenData 타입의 빈배열 명은 animalTokenData
        // new AnimalTokenData 빈배열에 담기는 길이 👉 NFT를 가지고있는 갯수

        for(uint256 i = 0; i < balanceLength2; i++) {
        // main.tsx에서는 최근순서대로 조회했으나 (배열의 맨 마지막 length - 1)
        // 👉 이번에는 for문으로 0번부터 순서대로 조회할것이다
        //--------------------------------------------
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner, i);
            // tokenOfOwnerByIndex는 👉 NFT의 Id 값을 조회 (인자는 주소와, 조회하려는 배열순번)
            // 👉 for문으로 돌려서 나온 i 값을 인자로 넣어준다
            //--------------------------------------------
            uint256 animalType = animalTypess[animalTokenId];
            // mapping 으로 가져온것은 대괄호[]로 인자를 가져와야한다
            // animalTypess는 👉 어떤 NFT를 뽑았는지 조회 (인자에는 NFT id를 넣는다)
            //--------------------------------------------
            uint256 animalPrice = saleAnimalToken.getAnimalTokenPrice(animalTokenId);
            // saleAnimalToken.sol 에서 정의된 함수를 import로 getAnimalTokenPrice를 그대로 가져옴
            // animalTokenId 를 인자로 👉 넣어서 가격을 확인한다
            //--------------------------------------------
            // 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆 이 함수에 담긴 내용들을
            // 어딘가에 담아서 계속 조회해서 한꺼번에 계속 불러와야하는데
            // struct로 정의된 AnimalTokenData 타입의 빈배열에 담는다 animalTokenData

            animalTokenData[i] = AnimalTokenData(animalTokenId, animalType, animalPrice);
            // 빈배열에 for문으로 돌려서 나온 i 순서대로 animalTokenId 빈배열에 push한다
            // AnimalTokenData 에 정의된 타입들
            // 👉 animalTokenId 에 맞는 / 위에 변수 animalType과 animalPrice는 자동으로 끌어옴
        }

        return animalTokenData;
        
    }

    function setSaleAnimalToken(address _saleAnimalToken) public {
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
        // Remix 에서 MintAnimalToken.sol 파일을 먼저 배포를 한 뒤에 
        // SaleAnimalToken.sol 파일을 배포 하고 나온 컨트랙트 주소를
        // MintAnimalToken.sol 배포된 컨트랙트주소 아래 함수 setSaleAnimalToken에
        // 넣어줘야 된다 ⭐⭐⭐⭐⭐⭐⭐⭐⭐
        // 그런 다음에서야 apiAnimalToken 함수를 사용할수 있다
        // ⭐⭐⭐⭐
        // SaleAnimalToken.sol 파일을 import 해서 getAnimalTokenPrice 함수를 사용하고 있으므로
        // 처음에 필수적으로 거쳐야 하는 작업
    }
}
