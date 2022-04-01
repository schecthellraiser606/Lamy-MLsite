export type AuthState = {
  isSignedIn: boolean;
  isLoading: boolean;
  id: string | undefined;
  name: string | undefined;
};

export type MyUserType = {
  worship: string;
  token: string;
};
