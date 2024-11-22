package com.myblog.board_back.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardListItem {

    private int boardNumber;

    private String title;

    private String content;

    private String boardTitleImage;

    private int favoriteCount;

    private int commentCount;

    private String writeDatetime;

    private String writerNickname;

    private String writerProfileImage;

}
