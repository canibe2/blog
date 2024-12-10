package com.myblog.board_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.myblog.board_back.entity.BoardEntity;
import com.myblog.board_back.repository.resultSet.GetBoardResultSet;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

    BoardEntity findByBoardNumber(Integer boardNumber);

    @Query(value = "SELECT B.board_number AS boardNumber,\r\n" + //
            "            B.title AS title,\r\n" + //
            "            B.content AS content,\r\n" + //
            "            B.write_datetime AS writerDatetime,\r\n" + //
            "            B.writer_email AS  writerEmail,\r\n" + //
            "            U.nickname AS writerNickname,\r\n" + //
            "            U.profile_image AS writerProfileImage\r\n" + //
            "FROM board AS B INNER JOIN user AS U\r\n" + //
            "ON B.writer_email = U.email\r\n" + //
            "WHERE board_number = ?1;", nativeQuery = true)
    GetBoardResultSet getBoard(Integer boardNumber);

}
