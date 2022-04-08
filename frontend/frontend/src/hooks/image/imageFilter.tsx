import { useCallback, useState } from "react";
import { LearningImagee } from "../../types/responseType";

type Paras = {
  worship: string;
  month: string;
  imageList: Array<LearningImagee>;
};

export const useImageFilter = () => {
  const [filterImage, setFilterImage] = useState<Array<LearningImagee> | null>(null);

  const filterWorship = useCallback((paras: Paras) => {
    const { worship, month, imageList } = paras;
    const is_month = month === "month" ? true : false;
    if (is_month) {
      const target = imageList.filter((image) => {
        const imageTime = new Date(image.updated_image_at);
        let now = new Date();
        console.log(imageTime);
        now.setMonth(now.getMonth() - 1);
        return image.class_name === worship && imageTime.getTime() >= now.getTime();
      });
      const tenImage = target.slice(0, 10);
      setFilterImage(tenImage ?? null);
    } else {
      const target = imageList.filter((image) => image.class_name === worship);
      const tenImage = target.slice(0, 10);
      setFilterImage(tenImage ?? null);
    }
  }, []);

  return { filterImage, filterWorship };
};
