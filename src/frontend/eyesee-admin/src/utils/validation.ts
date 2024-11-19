import { SignupRequest } from "@/types/auth";

export const signupValidation = (data: SignupRequest) => {
  const { adminEmail, adminName, password, passwordConfirm } = data;

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!adminEmail || !emailRegex.test(adminEmail)) {
    alert("이메일 형식을 확인하세요.");
    return false;
  }

  // 이름 빈 값 검증
  if (!adminName || adminName.trim() === "") {
    alert("이름을 다시 입력해주세요.");
    return false;
  }

  // 비밀번호 빈 값 검증
  if (!password || password.trim() === "") {
    alert("비밀번호를 입력해주세요.");
    return false;
  }

  // 비밀번호 확인 일치 검증
  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return false;
  }

  // 모든 검증 통과
  return true;
};
