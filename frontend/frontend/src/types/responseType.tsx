export type myUserApi = {
  created_at: string;
  displayname: string;
  updated_at: string;
  worship: string;
};

export type tokenCreateApi = {
  token: string;
};

export type LearningImagee = {
  accurancy: number;
  class_name: string;
  created_image_at: string;
  id: number;
  image: string;
  is_main: boolean;
  updated_image_at: string;
  user: {
    displayname: string;
    worship: string;
    created_user_at: string;
    updated_user_at: string;
  };
};
