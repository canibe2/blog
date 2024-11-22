package com.myblog.board_back.dto.request.auth;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank
    @Email
    // 이메일 (ID)
    private String email;
    @NotBlank
    @Size(min = 8, max = 20)
    // 비밀번호
    private String password;

    @NotBlank
    // 닉네임
    private String nickname;

    @NotBlank
    @Pattern(regexp = "^[0-9]{11,13}$")
    // 전화번호
    private String telNumber;

    @NotBlank
    // 주소
    private String address;

    // 상세 주소
    private String addressDetail;

    @NotNull
    @AssertTrue
    // 개인정보 동의여부
    private Boolean agreedPersonal;

}
