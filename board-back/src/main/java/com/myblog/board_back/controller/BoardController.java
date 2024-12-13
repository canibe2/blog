package com.myblog.board_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myblog.board_back.dto.request.board.PostBoardRequestDto;
import com.myblog.board_back.dto.request.board.PostCommentRequestDto;
import com.myblog.board_back.dto.response.board.GetBoardResponseDto;
import com.myblog.board_back.dto.response.board.GetFavoriteListResponseDto;
import com.myblog.board_back.dto.response.board.PostBoardResponseDto;
import com.myblog.board_back.dto.response.board.PostCommentResponseDto;
import com.myblog.board_back.dto.response.board.PutFavoriteResponseDto;
import com.myblog.board_back.service.BoardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService BoardService;

    @GetMapping("/{boardNumber}")
    public ResponseEntity<? super GetBoardResponseDto> getBoard(@PathVariable("boardNumber") Integer boardNumbInteger) {
        ResponseEntity<? super GetBoardResponseDto> response = BoardService.getBoard(boardNumbInteger);

        return response;
    }

    @GetMapping("/{boardNumber}/favorite-list")
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(
            @PathVariable("boardNumber") Integer boardNumber) {

        ResponseEntity<? super GetFavoriteListResponseDto> response = BoardService.getFavoriteList(boardNumber);

        return response;

    }

    @PostMapping("")
    public ResponseEntity<? super PostBoardResponseDto> postBoard(@RequestBody @Valid PostBoardRequestDto requestBody,
            @AuthenticationPrincipal String email) {
        ResponseEntity<? super PostBoardResponseDto> response = BoardService.postBoard(requestBody, email);

        return response;

    }

    @PostMapping("/{boardNumber}/comment")
    public ResponseEntity<? super PostCommentResponseDto> postComment(
            @RequestBody @Valid PostCommentRequestDto requestBody, @PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal String email) {

        ResponseEntity<? super PostCommentResponseDto> response = BoardService.postComment(requestBody, boardNumber,
                email);

        return response;

    }

    @PutMapping("/{boardNumber}/favorite")
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(@PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal String email) {

        ResponseEntity<? super PutFavoriteResponseDto> response = BoardService.putFavorite(boardNumber, email);

        return response;
    }
}
