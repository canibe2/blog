package com.myblog.board_back.service;

import org.springframework.http.ResponseEntity;

import com.myblog.board_back.dto.response.search.GetPopularListResponseDto;
import com.myblog.board_back.dto.response.search.GetRelationListResponseDto;

public interface SearchService {

    ResponseEntity<? super GetPopularListResponseDto> getPopularList();

    ResponseEntity<? super GetRelationListResponseDto> getRelationList(String searchWord);

}
