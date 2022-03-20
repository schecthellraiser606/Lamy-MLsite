import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { memo, VFC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MenuIconButton } from "../../atoms/buttons/MenuIconButton";
import { AvatorPopover } from "../../molecules/Avator/avatorPopover";
import { MenuDrawer } from "../../molecules/menuDrawer";

// eslint-disable-next-line react/display-name
export const Header: VFC = memo(() => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickHome = () => {
    router.push("/");
  };

  return (
    <>
      <Flex as="nav" bg="cyan.400" color="gray.100" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <Link href="/" passHref>
          <Flex align="center" as="a" mr={8} _hover={{ cursor: "pointer" }}>
            <Heading as="h1" fontSize={{ base: "lg", md: "5xl" }} fontFamily="Yuji Syuku">
              俺が本物のラミィだ
            </Heading>
          </Flex>
        </Link>

        <Flex align="center" fontSize="sm" display={{ base: "none", md: "flex" }}>
          <Link href="/thread/thread_index" passHref>
            <Heading as="h3" fontSize="xl" fontFamily="Yuji Syuku" borderBottom="1px" marginRight={4} _hover={{ cursor: "pointer" }}>
              掲示板一覧
            </Heading>
          </Link>
          <Box pr={4}>
            <AvatorPopover />
          </Box>
        </Flex>

        <MenuIconButton onOpen={onOpen} />
      </Flex>
      <MenuDrawer onClose={onClose} isOpen={isOpen} onClickHome={onClickHome} />
    </>
  );
});
