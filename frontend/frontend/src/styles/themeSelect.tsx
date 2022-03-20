import { extendTheme } from "@chakra-ui/react";

const themeSelect = extendTheme({
  styles: {
    global: {
      body: {
        color: "black",
      },
    },
  },
});

export default themeSelect;
