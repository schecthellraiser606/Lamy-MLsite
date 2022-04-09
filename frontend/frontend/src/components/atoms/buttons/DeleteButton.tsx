import { Button, Divider, Flex, Spacer } from "@chakra-ui/react";
import { memo, ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
  disable?: boolean;
  loading?: boolean;
  is_author: boolean;
  onClick: () => void;
};

// eslint-disable-next-line react/display-name
export const DeleteButton: VFC<Props> = memo((props) => {
  const { children, disable = false, loading = false, onClick, is_author = false } = props;

  return (
    <>
      {is_author ? (
        <>
          <Divider p={1} />
          <Flex align="center" flexDirection="row">
            <Spacer />
            <Button
              bg="red"
              _hover={{ opacity: 0.8 }}
              disabled={disable || loading}
              isLoading={loading}
              onClick={onClick}
            >
              {children}
            </Button>
          </Flex>
        </>
      ) : (
        <></>
      )}
    </>
  );
});
