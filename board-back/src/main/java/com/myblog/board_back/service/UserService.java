package com.myblog.board_back.service;

import org.springframework.http.ResponseEntity;
import com.myblog.board_back.dto.response.user.GetSignInUserResponseDto;
import com.myblog.board_back.dto.response.user.GetUserResponseDto;

public interface UserService {

    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);

    ResponseEntity<? super GetUserResponseDto> getUser(String email);

}
