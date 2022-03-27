import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import axios from "axios";
import { memo, useCallback, useState, VFC } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import useIsomorphicLayoutEffect from "../../../hooks/canUseDom";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";

type MyFile = File & {
  preview: string;
};

// eslint-disable-next-line react/display-name
export const DropZone: VFC = memo(() => {
  const url = "http://localhost:8000/aiapps/predict/";
  const acceptFile = "image/*";
  const maxFileSize = 1048576;

  const [files, setFiles] = useState<MyFile>();
  const [isfile, setIsFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("onDrop");
    // previewの追加
    const images = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    const first = images.shift();
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

  const onClick = () => {
    setUploading(true);
    axios
      .post(url, files, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err))
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
        <input {...getInputProps()} />
        <Box backgroundColor="aqua" borderRadius="md" opacity="0.4" padding="40px">
          <Heading fontFamily="Yuji Syuku" color="black">
            画像アップ...
          </Heading>
          <br />
          <Box borderWidth="2px" borderColor="blue.400" borderStyle="dotted" padding="20px">
            {isDragActive ? (
              <Text fontSize="lg" color="black">
                Drop the files here ...
              </Text>
            ) : (
              <Text fontFamily="Yuji Syuku" fontSize="lg" color="black">
                ここにお主が雪花ラミィだと証明できる画像を貼るのだ
                <br />
                Drag and Drop one file here, or click to select one file
              </Text>
            )}
          </Box>
        </Box>
      </SDiv>
      <Flex flexDirection="row">
        <Spacer />
        <PrimaryButton onClick={onClick} disable={isfile} loading={uploading} >
          AI判定じゃ！
        </PrimaryButton>
      </Flex>
    </Box>
  );
});

const SDiv = styled.div`
 margin-bottom: 5px
`;
