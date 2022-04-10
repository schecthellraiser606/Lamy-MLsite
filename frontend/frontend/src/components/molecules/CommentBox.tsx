import { memo, useRef, VFC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../store/userState";
import styled from "styled-components";
import { Comments } from "../../types/responseType";
import { Flex, useDisclosure, Button, Stack, Spacer, Text } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { DeleteButton } from "../atoms/buttons/DeleteButton";
import { useCommentHook } from "../../hooks/thread/commentHook";
import { AlertDialogComp } from "./Alert/AlertDialog";
import { AvatorOnComment } from "./Avator/avatorOnComment";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { parentCommentState } from "../../store/parentCommentState";

type Props = {
  comment: Comments;
  key: number;
  index: number;
};

// eslint-disable-next-line react/display-name
export const CommentBox: VFC<Props> = memo((props) => {
  const { comment, index } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const signInUser = useRecoilValue(userState);
  const setParent = useSetRecoilState(parentCommentState);
  const { commentLoading, commentDelete } = useCommentHook();

  const deleteHook = () => {
    commentDelete(comment.id);
    onClose();
  };

  const onClickRep = () => {
    setParent({ id: comment.id });
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scrollTo({
      top: bottom,
      behavior: "smooth",
    });
  };

  return (
    <>
      {signInUser.id === comment.user.uid ? (
        <>
          <Flex flexDirection="row-reverse" align="center" id={index.toString()}>
            <AvatorOnComment comment={comment} />
            <MessageRight>
              <Stack>
                {comment.parent_id ? (
                  <>
                    <AnchorLink href={"#" + comment.parent_id.toString()}>{">>" + comment.parent_id}</AnchorLink>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {comment.text === "This Data was Deleted" ? (
                  <Text as="i" color="black" fontFamily="Yuji Syuku">
                    {comment.text}
                  </Text>
                ) : (
                  <>
                    <Text color="black" fontFamily="Yuji Syuku">
                      {comment.text}
                    </Text>
                    <DeleteButton onClick={onOpen} loading={commentLoading}>
                      削除
                    </DeleteButton>
                  </>
                )}
              </Stack>
            </MessageRight>
          </Flex>
          <AlertDialogComp
            isOpen={isOpen}
            onClose={onClose}
            cancelRef={cancelRef}
            deleteHook={deleteHook}
            isLoading={commentLoading}
          />
        </>
      ) : (
        <Flex flexDirection="row" id={index.toString()}>
          <AvatorOnComment comment={comment} />
          <MessageLeft>
            <Stack>
              {comment.parent_id ? (
                <>
                  <AnchorLink href={"#" + comment.parent_id.toString()}>{">>" + comment.parent_id}</AnchorLink>
                  <br />
                </>
              ) : (
                <></>
              )}
              {comment.text === "This Data was Deleted" ? (
                <Text as="i" color="black" fontFamily="Yuji Syuku">
                  {comment.text}
                </Text>
              ) : (
                <>
                  <Text color="black" fontFamily="Yuji Syuku">
                    {comment.text}
                  </Text>
                  <Flex flexDirection="row" align="center">
                    <Spacer />
                    <Button
                      rightIcon={<ArrowRightIcon />}
                      colorScheme="cyan"
                      variant="outline"
                      onClick={onClickRep}
                      size="xs"
                    >
                      返信する
                    </Button>
                  </Flex>
                </>
              )}
            </Stack>
          </MessageLeft>
        </Flex>
      )}
    </>
  );
});

const MessageRight = styled.div`
  position: relative;
  display: inline-block;
  padding: 0 15px;
  width: 90%;
  min-width: 115px;
  height: auto;
  line-height: 34px;
  color: #19283c;
  text-align: left;
  background: #ccffff;
  border: 3px solid #02ffff;
  z-index: 0;
  border-radius: 10px;
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    right: -9px;
    margin-top: -9px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 9px 0 9px 9px;
    border-color: transparent transparent transparent #ccffff;
    z-index: 0;
  }
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    right: -13px; /*位置調整*/
    margin-top: -10px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 10px 0 10px 10px;
    border-color: transparent transparent transparent #02ffff;
    z-index: -1;
  }
`;

const MessageLeft = styled.div`
  position: relative;
  display: inline-block;
  padding: 0 15px;
  width: 90%;
  min-width: 115px;
  height: auto;
  line-height: 34px;
  color: #19283c;
  text-align: left;
  background: #b3b8bb;
  border: 3px solid #19283c;
  z-index: 0;
  border-radius: 10px;
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -9px;
    margin-top: -9px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 9px 9px 9px 0;
    border-color: transparent #b3b8bb transparent transparent;
    z-index: 0;
  }
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: -13px; /*位置調整*/
    margin-top: -10px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 10px 10px 10px 0;
    border-color: transparent #19283c transparent transparent;
    z-index: -1;
  }
`;
