import { Box, Flex, Grid, GridItem, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { memo, VFC } from "react";

// eslint-disable-next-line react/display-name
export const Footer: VFC = memo(() => {
  return (
    <footer>
      <Flex
        as="nav"
        bg="cyan.400"
        color="gray.200"
        justifyContent="center"
        alignItems="center"
        padding={{ base: 3, md: 5 }}
      >
        <Stack>
          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem w="100%" textAlign="center">
                <Link href="/">トップ</Link>
              </GridItem>
              <GridItem w="100%" textAlign="center">
                <Link href="/thread/thread_index">掲示板</Link>
              </GridItem>
            </Grid>
          </Box>

          <Text fontSize="md" justifyContent="center">
            &copy; 暇人ギター日記. 2022.03
          </Text>
        </Stack>
      </Flex>
    </footer>
  );
});
