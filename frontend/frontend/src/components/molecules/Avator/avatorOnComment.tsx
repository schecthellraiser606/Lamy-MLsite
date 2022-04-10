import { memo, VFC } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  Portal,
  Avatar,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Comments } from "../../../types/responseType";

type Props = {
  comment: Comments;
};

// eslint-disable-next-line react/display-name
export const AvatorOnComment: VFC<Props> = memo((props) => {
  const { comment } = props;

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="commentAvator"
          size="sm"
          variant="unstyled"
          icon={comment.user.uid ? <Avatar name={comment.user.displayname} /> : <Avatar />}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent backgroundColor="blue.500">
          <PopoverArrow />
          <PopoverHeader>ユーザ情報</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Stack>
              <Text>名前: {comment.user.displayname}</Text>
              <Text>推し: {comment.user.worship}</Text>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
