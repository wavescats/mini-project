// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./SaleAnimalToken.sol";

// ๐ ์๋๋ contract๋ฐ์ SaleAnimalToken๋ฅผ ์ ์ํด ์ค์ผํ๋
// ์๊ฐ์์ผ๋ก๋ MintAnimalToken์์์ SaleAnimalToken์ด ๋จผ์  ์กด์ฌ ํ ์ ์๊ธฐ ๋๋ฌธ์
// import๋ก .sol ํ์ผ ์์ฒด๋ฅผ ๋ถ๋ฌ์จ๋ค

contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("wave", "WAV") {}
    // ์ด๋ฆ๊ณผ ์ฌ๋ณผ ์ค์ 

    SaleAnimalToken public saleAnimalToken;
    // ๐ ์์์ import๋ก ๋ถ๋ฌ์จ SaleAnimalToken๋ฅผ ์ด์  ์ ์ํ ์ ์๋ค
    // SaleAnimalToken ์ ๋ฐฐํฌํ๋ฉด ๋์ค๋ ์ฃผ์๋ฅผ ๐ (s๊ฐ ์๋ฌธ์) saleAnimalToken ๋ด๋๋ค

    mapping(uint256 => uint256) public animalTypess;
    // ํค๊ฐ์ ํ์ => ๋ฐธ๋ฅ๊ฐ์ ํ์  / ์ ๊ทผ์ ํ์ / mapping ์ด๋ฆ

    struct AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
        uint256 animalPrice;
    }// struct๋ก AnimalTokenData์ด๋ผ๋ ํ์์ ์ ์ ํด์ค์ผ๋ก์จ 
     // AnimalTokenDataํ์์ ๋ฐฐ์ด์ ๋ง๋ค์ ์๋ค

    function mintAnimalToken() public {
        uint256 animalTokenId = totalSupply() + 1;
        // ์ด ๊ณต๊ธ๋ + 1์ฉ ์ฆ๊ฐ

        // ์๋ฆฌ๋ํฐ์์ ๋๋คํ ๊ฐ์ ๋ฝ์๋ด๋ ๋ฒ ๐
        uint256 animalType = (uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, animalTokenId)
            )
        ) % 5) + 1;
        // keccak256์ ํตํด ๋๋คํ uint256 ํ์์ธ  JSON ํ์์ ์ธํฐํ์ด์ค๋ฅผ ๋ง๋ ๋ค (์คํํ ์๊ฐ, ๋๊ฐ ์คํํ๋์ง, nft๋ฅผ)
        // % 5 ํ๋ฉด 0๋ถํฐ 4๊น์ง์ ๊ฐ์ด (0 ~ 4) ๋์ค๋๋ฐ ๊ฑฐ๊ธฐ์ +1์ ํ๋ฉด 1๋ถํฐ 5๊น์ง์ ๊ฐ์ด (1 ~ 5) ๋์จ๋ค

        animalTypess[animalTokenId] = animalType;
        // 1 ~ 5๋ฒ ๊น์ง์ ๊ฐ์ด ๋ฏผํํ  _mint์ ๋ค์ด๊ฐ๋ค

        _mint(msg.sender, animalTokenId);
        // msg.sender ๐ ์ค๋งํธ์ปจํธ๋ํธ๋ฅผ ์ฌ์ฉํ๋ ์ฃผ์ฒด
        // ๋ฏผํ ํ ๋๋ง๋ค animalTokenId + 1
    }

    function apiAnimalToken(address _animalTokenOwner) view public returns (AnimalTokenData[] memory) {
        // struct๋ก AnimalTokenData์ด๋ผ๋ ํ์์ ์ ์ ํด์ค์ผ๋ก์จ ๐ AnimalTokenDataํ์์ ๋ฐฐ์ด์ ๋ง๋ค์ ์๋ค
        // memory   ๐ ํจ์์ ํ๋ผ๋ฏธํฐ / ๋ฆฌํด๊ฐ / ๋ ํผ๋ฐ์ค ํ์์ด ์ ์ฅ๋๋ค
        //              ์์์ ์ผ๋ก ์ ์ฅ๋์ง๋ ์๊ณ  / ํจ์ ๋ด์์๋ง ์ ํจํ๋ค / ๊ฐ์ค๋น์ฉ์ด ์ธ๋ค
        //--------------------------------------------
        uint256 balanceLength2 = balanceOf(_animalTokenOwner);
        // balanceOf๋ ๐ NFT ๊ฐ์ง๊ณ ์๋ ๊ฐฏ์ ์กฐํ (์ธ์์๋ ์ฃผ์๋ฅผ ๋ฃ์ด์ผํ๋ค)

        require (balanceLength2 != 0, "Owner did not have token");
        // ์๋ฌํธ๋ค๋ฌ require ๐ ํน์ ํ ์กฐ๊ฑด์ ๋ถํฉํ์ง ์์ผ๋ฉด ์๋ฌ๋ฅผ ๋ฐ์์ํค๊ณ  (โญ false ์ผ ๋) / gas๋ฅผ ํ๋ถ ์์ผ์ค๋ค
        // balanceLength2 ๊ฐ 0์ด ์๋๋ฉด ๐ ๋ค์์ค ๐ 0์ด๋ฉด NFT๊ฐ ํ๊ฐ๋ ์๋ค๋ ๋ป์ด๋ฏ๋ก ๋ฌธ๊ตฌ๋ฅผ ์ถ๋ ฅํ๋ค

        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](balanceLength2);
        // struct๋ก ์ ์๋ AnimalTokenData ํ์์ ๋น๋ฐฐ์ด ๋ช์ animalTokenData
        // new AnimalTokenData ๋น๋ฐฐ์ด์ ๋ด๊ธฐ๋ ๊ธธ์ด ๐ NFT๋ฅผ ๊ฐ์ง๊ณ ์๋ ๊ฐฏ์

        for(uint256 i = 0; i < balanceLength2; i++) {
        // main.tsx์์๋ ์ต๊ทผ์์๋๋ก ์กฐํํ์ผ๋ (๋ฐฐ์ด์ ๋งจ ๋ง์ง๋ง length - 1)
        // ๐ ์ด๋ฒ์๋ for๋ฌธ์ผ๋ก 0๋ฒ๋ถํฐ ์์๋๋ก ์กฐํํ ๊ฒ์ด๋ค
        //--------------------------------------------
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner, i);
            // tokenOfOwnerByIndex๋ ๐ NFT์ Id ๊ฐ์ ์กฐํ (์ธ์๋ ์ฃผ์์, ์กฐํํ๋ ค๋ ๋ฐฐ์ด์๋ฒ)
            // ๐ for๋ฌธ์ผ๋ก ๋๋ ค์ ๋์จ i ๊ฐ์ ์ธ์๋ก ๋ฃ์ด์ค๋ค
            //--------------------------------------------
            uint256 animalType = animalTypess[animalTokenId];
            // mapping ์ผ๋ก ๊ฐ์ ธ์จ๊ฒ์ ๋๊ดํธ[]๋ก ์ธ์๋ฅผ ๊ฐ์ ธ์์ผํ๋ค
            // animalTypess๋ ๐ ์ด๋ค NFT๋ฅผ ๋ฝ์๋์ง ์กฐํ (์ธ์์๋ NFT id๋ฅผ ๋ฃ๋๋ค)
            //--------------------------------------------
            uint256 animalPrice = saleAnimalToken.getAnimalTokenPrice(animalTokenId);
            // saleAnimalToken.sol ์์ ์ ์๋ ํจ์๋ฅผ import๋ก getAnimalTokenPrice๋ฅผ ๊ทธ๋๋ก ๊ฐ์ ธ์ด
            // animalTokenId ๋ฅผ ์ธ์๋ก ๐ ๋ฃ์ด์ ๊ฐ๊ฒฉ์ ํ์ธํ๋ค
            //--------------------------------------------
            // ๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐ ์ด ํจ์์ ๋ด๊ธด ๋ด์ฉ๋ค์
            // ์ด๋๊ฐ์ ๋ด์์ ๊ณ์ ์กฐํํด์ ํ๊บผ๋ฒ์ ๊ณ์ ๋ถ๋ฌ์์ผํ๋๋ฐ
            // struct๋ก ์ ์๋ AnimalTokenData ํ์์ ๋น๋ฐฐ์ด์ ๋ด๋๋ค animalTokenData

            animalTokenData[i] = AnimalTokenData(animalTokenId, animalType, animalPrice);
            // ๋น๋ฐฐ์ด์ for๋ฌธ์ผ๋ก ๋๋ ค์ ๋์จ i ์์๋๋ก animalTokenId ๋น๋ฐฐ์ด์ pushํ๋ค
            // AnimalTokenData ์ ์ ์๋ ํ์๋ค
            // ๐ animalTokenId ์ ๋ง๋ / ์์ ๋ณ์ animalType๊ณผ animalPrice๋ ์๋์ผ๋ก ๋์ด์ด
        }

        return animalTokenData;
        
    }

    function setSaleAnimalToken(address _saleAnimalToken) public {
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
        // Remix ์์ MintAnimalToken.sol ํ์ผ์ ๋จผ์  ๋ฐฐํฌ๋ฅผ ํ ๋ค์ 
        // SaleAnimalToken.sol ํ์ผ์ ๋ฐฐํฌ ํ๊ณ  ๋์จ ์ปจํธ๋ํธ ์ฃผ์๋ฅผ
        // MintAnimalToken.sol ๋ฐฐํฌ๋ ์ปจํธ๋ํธ์ฃผ์ ์๋ ํจ์ setSaleAnimalToken์
        // ๋ฃ์ด์ค์ผ ๋๋ค โญโญโญโญโญโญโญโญโญ
        // ๊ทธ๋ฐ ๋ค์์์์ผ apiAnimalToken ํจ์๋ฅผ ์ฌ์ฉํ ์ ์๋ค
        // โญโญโญโญ
        // SaleAnimalToken.sol ํ์ผ์ import ํด์ getAnimalTokenPrice ํจ์๋ฅผ ์ฌ์ฉํ๊ณ  ์์ผ๋ฏ๋ก
        // ์ฒ์์ ํ์์ ์ผ๋ก ๊ฑฐ์ณ์ผ ํ๋ ์์
    }
}
