import { useCallback, useState } from "react";
import { LearningImagee } from "../../types/responseType";

type Paras = {
  worship: string;
  is_month: boolean;
  imageList: Array<LearningImagee>;
};

export const useImageFilter = () => {
  const [filterImage, setFilterImage] = useState<Array<LearningImagee> | null>(null);

  const filterWorship = useCallback((paras: Paras) => {
    const { worship, is_month, imageList } = paras;
  }, []);
};
