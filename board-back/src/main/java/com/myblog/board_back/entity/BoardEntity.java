package com.myblog.board_back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "board")
@Table(name = "board")
public class BoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int boardNumber;

    @Column(name = "title")
    private String title;
    @Column(name = "content")
    private String content;
    @Column(name = "write_datetime")
    private String writeDatetime;
    @Column(name = "favorite_count")
    private int favoriteCount;
    @Column(name = "comment_count")
    private int commentCount;
    @Column(name = "view_count")
    private int viewCount;
    @Column(name = "writer_email")
    private String writerEmail;

}
