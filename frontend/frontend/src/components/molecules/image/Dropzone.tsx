import { Box, Heading, Text } from "@chakra-ui/react";
import { memo, useCallback, useState, VFC } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

type MyFile = File & {
  preview: string;
};

// eslint-disable-next-line react/display-name
export const DropZone: VFC = memo(() => {
  const acceptFile = "image/*";
  const maxFileSize = 1048576;

  const [files, setFiles] = useState<MyFile>();
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

  return (
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
  );
});

const SDiv = styled.div`
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: auto;
  padding: 1%;
`;
