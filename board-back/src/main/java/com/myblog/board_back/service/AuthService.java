package com.myblog.board_back.service;

import org.springframework.http.ResponseEntity;

import com.myblog.board_back.dto.request.auth.SignInRequestDto;
import com.myblog.board_back.dto.request.auth.SignUpRequestDto;
import com.myblog.board_back.dto.response.auth.SignInResponseDto;
import com.myblog.board_back.dto.response.auth.SignUpResponseDto;

public interface AuthService {

    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
}
