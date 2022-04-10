import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/userState";
import styled from "styled-components";
import { Comments } from "../../types/responseType";

type Props = {
  comment: Comments;
  key: number;
};

// eslint-disable-next-line react/display-name
export const CommentBox: VFC<Props> = memo((props) => {
  const { comment } = props;
  const signInUser = useRecoilValue(userState);

  return (
    <>
      {signInUser.id === comment.name ? (
        <MessageRight>{comment.body}</MessageRight>
      ) : (
        <MessageLeft>{comment.body}</MessageLeft>
      )}
    </>
  );
});

const MessageRight = styled.div`
  position: relative;
  display: inline-block;
  padding: 0 15px;
  width: auto;
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
  width: auto;
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
