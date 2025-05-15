package com.myblog.board_back.service;

import org.springframework.http.ResponseEntity;

import com.myblog.board_back.dto.response.search.GetPopularListResponseDto;

public interface SearchService {

    ResponseEntity<? super GetPopularListResponseDto> getPopularList();

}
