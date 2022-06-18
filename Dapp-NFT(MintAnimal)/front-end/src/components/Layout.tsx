import { Flex, Stack, Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <Stack h="100vh">
      {/* Stack은 아래로 계속 쌓인다는것 */}
      <Flex
        bg="purple.400"
        p={4}
        justifyContent="space-around"
        alignItems="center"
        // 배경색상을 보라색, 패딩은 4, 가로로 펼치기 가운데 정렬
      >
        <Box>
          <Text fontWeight="bold" color="#fff">
            wavesdoge
          </Text>
        </Box>
        <Link to="/">
          <Button size="sm" colorScheme="blue">
            Main
          </Button>
        </Link>
        {/* 버튼을 누르면 페이지 전환하는 구현 */}
        <Link to="my-animal">
          <Button size="sm" colorScheme="red">
            My Animal
          </Button>
        </Link>
        {/* 버튼을 누르면 페이지 전환하는 구현 */}
        <Link to="sale-animal">
          <Button size="sm" colorScheme="green">
            Sale Animal
          </Button>
        </Link>
      </Flex>
      <Flex
        direction="column"
        h="full"
        justifyContent="center"
        alignItems="center"
        // 정렬은 세로로 / 센터로 맞춰주기 위한 CSS 설정
      >
        {children}
      </Flex>
    </Stack>
  );
};

export default Layout;
