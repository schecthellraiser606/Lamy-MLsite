import { Button, Divider, Flex, Spacer } from "@chakra-ui/react";
import { memo, ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
  disable?: boolean;
  loading?: boolean;
  onClick: () => void;
};

// eslint-disable-next-line react/display-name
export const DeleteButton: VFC<Props> = memo((props) => {
  const { children, disable = false, loading = false, onClick } = props;

  return (
    <Flex align="center" flexDirection="row">
      <Spacer />
      <Button
        bg="red"
        _hover={{ opacity: 0.8 }}
        disabled={disable || loading}
        isLoading={loading}
        onClick={onClick}
        marginTop={1}
        size="xs"
      >
        {children}
      </Button>
    </Flex>
  );
});
