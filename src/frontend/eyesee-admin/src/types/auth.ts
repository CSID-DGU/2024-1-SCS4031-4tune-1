export type SignupRequest = {
  adminEmail: string;
  adminName: string;
  password: string;
  passwordConfirm: string;
};

export type SignupResponse = {
  access_token: string;
  refresh_token: string;
};

export type SigninRequest = {
  adminEmail: string;
  password: string;
};

export type SigninResponse = {
  access_token: string;
  refresh_token: string;
};
