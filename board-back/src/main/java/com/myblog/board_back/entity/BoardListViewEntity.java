package com.myblog.board_back.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "board_list_view")
@Table(name = "board_list_view")
public class BoardListViewEntity {

    @Id
    private int boardNumber;

    private String title;

    private String content;

    private String title_image;

    private int view_count;

    private int favorite_count;

    private int comment_count;

    private String writeDatetime;

    private String writerEmail;

    private String writerNickname;

    private String writerProfileImage;

}
