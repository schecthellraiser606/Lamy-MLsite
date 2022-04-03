import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { memo, useCallback, useState, VFC } from "react";
import { useDropzone } from "react-dropzone";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import useIsomorphicLayoutEffect from "../../../hooks/canUseDom";
import { useMessage } from "../../../hooks/useMessage";
import { myImageState } from "../../../store/myImageState";
import { myTokenState } from "../../../store/myUserState";
import { userState } from "../../../store/userState";
import { LearningImagee } from "../../../types/responseType";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";

// eslint-disable-next-line react/display-name
export const DropZone: VFC = memo(() => {
  const url = "http://localhost:8000/aiapps/image/";
  const acceptFile = "image/*";
  const maxFileSize = 1048576;
  const router = useRouter();

  const signInUser = useRecoilValue(userState);
  const myToken = useRecoilValue(myTokenState);
  const setLearningImage = useSetRecoilState(myImageState);

  const [files, setFiles] = useState<File>();
  const [name, setName] = useState("");
  const [isfile, setIsFile] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("onDrop");

    const images = acceptedFiles.map((file) => Object.assign(file));

    const first = images.pop();
    setName(URL.createObjectURL(first));
    setFiles(first);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptFile,
    minSize: 0,
    maxSize: maxFileSize,
  });

  useIsomorphicLayoutEffect(() => {
    if (files) {
      setIsFile(false);
    } else {
      setIsFile(true);
    }
  }, [files]);

  const { showMessage } = useMessage();

  const onClick = () => {
    setUploading(true);
    let form_data = new FormData();
    if (files && signInUser.id) {
      form_data.append("image", files);
      form_data.append("uid", signInUser.id);
      form_data.append("is_main", "False");
      form_data.append("class_name", "");
      form_data.append("accurancy", "");
    }

    axios
      .post<LearningImagee>(url, form_data, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `${myToken.token}`,
        },
      })
      .then((res) => {
        setLearningImage(res.data);
        router.push("/result");
      })
      .catch((err) => {
        showMessage({ title: "AI判定に失敗しました。再度ログインして下さい。", status: "error" });
        router.push("/user_setting");
      })
      .finally(() => setUploading(false));
  };

  return (
    <Box
      padding={2}
      backgroundColor="gray.600"
      marginRight="auto"
      marginTop="6px"
      marginBottom="auto"
      borderRadius="5px"
    >
      <SDiv {...getRootProps({ refKey: "innerRef" })}>
        <input {...getInputProps()} accept="image/png, image/jpeg" />
        <Box backgroundColor="aqua" borderRadius="md" opacity="0.4" padding="40px">
          <Heading fontFamily="Yuji Syuku" color="black">
            画像アップ...(ログイン要)
          </Heading>
          <br />
          <Box borderWidth="2px" borderColor="blue.400" borderStyle="dotted" padding="20px">
            {isDragActive ? (
              <Text fontFamily="Yuji Syuku" fontSize="lg" color="black">
                Drop the files here ...
              </Text>
            ) : (
              <Text fontFamily="Yuji Syuku" fontSize="lg" color="black">
                ここにお主が雪花ラミィだと証明できる画像を貼るのだ。
                <br />
                お主の画像として登録されるぞ。
                <br />
                Drag and Drop one file here, or click to select one file.
                <br />
                And this will be registered as your image.
              </Text>
            )}
          </Box>
        </Box>
      </SDiv>
      <Flex flexDirection="row">
        <Spacer />
        <PrimaryButton onClick={onClick} disable={isfile || !signInUser.isSignedIn} loading={uploading}>
          AI判定じゃ！
        </PrimaryButton>
      </Flex>
    </Box>
  );
});

const SDiv = styled.div`
  margin-bottom: 5px;
`;
