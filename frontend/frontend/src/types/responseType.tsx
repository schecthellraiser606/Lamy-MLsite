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
    uid: string;
    displayname: string;
    worship: string;
    created_user_at: string;
    updated_user_at: string;
  };
};

export type Thread = {
  id: number;
  user: {
    uid: string;
    displayname: string;
    worship: string;
    created_user_at: string;
    updated_user_at: string;
  };
  title: string;
  text: string;
  created_thread_at: string;
  updated_thread_at: string;
};

export type Comments = {
  id: number;
  user: {
    uid: string;
    displayname: string;
    worship: string;
    created_user_at: string;
    updated_user_at: string;
  };
  threads: {
    id: number;
    user: {
      displayname: string;
      worship: string;
      created_user_at: string;
      updated_user_at: string;
    };
    title: string;
    text: string;
    created_thread_at: string;
    updated_thread_at: string;
  };
  parent_id: number | null;
  text: string;
  created_comment_at: string;
  updated_comment_at: string;
};
