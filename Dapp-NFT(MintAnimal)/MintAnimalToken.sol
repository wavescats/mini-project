// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("wave", "WAV") {}

    // 이름과 심볼 설정

    mapping(uint256 => uint256) public animalTypess;

    // 키값의 타입 => 밸류값의 타입  / 접근제한자 / mapping 이름

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
}
