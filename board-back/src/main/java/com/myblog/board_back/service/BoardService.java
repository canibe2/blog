package com.myblog.board_back.service;

import org.springframework.http.ResponseEntity;

import com.myblog.board_back.dto.request.board.PostBoardRequestDto;
import com.myblog.board_back.dto.response.board.GetBoardResponseDto;
import com.myblog.board_back.dto.response.board.GetFavoriteListResponseDto;
import com.myblog.board_back.dto.response.board.PostBoardResponseDto;
import com.myblog.board_back.dto.response.board.PutFavoriteResponseDto;

public interface BoardService {
    ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber);

    ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber);

    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);

    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email);

}
