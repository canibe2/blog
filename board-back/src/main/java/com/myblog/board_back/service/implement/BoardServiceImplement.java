package com.myblog.board_back.service.implement;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.myblog.board_back.dto.request.board.PatchBoardRequestDto;
import com.myblog.board_back.dto.request.board.PostBoardRequestDto;
import com.myblog.board_back.dto.request.board.PostCommentRequestDto;
import com.myblog.board_back.dto.response.ResponseDto;
import com.myblog.board_back.dto.response.board.DeleteBoardResponseDto;
import com.myblog.board_back.dto.response.board.GetBoardResponseDto;
import com.myblog.board_back.dto.response.board.GetCommentListResponseDto;
import com.myblog.board_back.dto.response.board.GetFavoriteListResponseDto;
import com.myblog.board_back.dto.response.board.GetLatestBoardListResponseDto;
import com.myblog.board_back.dto.response.board.GetSearchBoardListResponseDto;
import com.myblog.board_back.dto.response.board.GetTop3BoardListResponseDto;
import com.myblog.board_back.dto.response.board.GetUserBoardListResponseDto;
import com.myblog.board_back.dto.response.board.IncreaseViewCountResponseDto;
import com.myblog.board_back.dto.response.board.PatchBoardResponseDto;
import com.myblog.board_back.dto.response.board.PostBoardResponseDto;
import com.myblog.board_back.dto.response.board.PostCommentResponseDto;
import com.myblog.board_back.dto.response.board.PutFavoriteResponseDto;
import com.myblog.board_back.entity.BoardEntity;
import com.myblog.board_back.entity.BoardListViewEntity;
import com.myblog.board_back.entity.CommentEntity;
import com.myblog.board_back.entity.FavoriteEntity;
import com.myblog.board_back.entity.ImageEntity;
import com.myblog.board_back.entity.SearchLogEntity;
import com.myblog.board_back.repository.BoardListViewRepository;
import com.myblog.board_back.repository.BoardRepository;
import com.myblog.board_back.repository.CommentRepository;
import com.myblog.board_back.repository.FavoriteRepository;
import com.myblog.board_back.repository.ImageRepository;
import com.myblog.board_back.repository.SearchLogRepository;
import com.myblog.board_back.repository.UserRepository;
import com.myblog.board_back.repository.resultSet.GetBoardResultSet;
import com.myblog.board_back.repository.resultSet.GetCommentListResultSet;
import com.myblog.board_back.repository.resultSet.GetFavoriteListResultSet;
import com.myblog.board_back.service.BoardService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardServiceImplement implements BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final FavoriteRepository favoriteRepository;
    private final CommentRepository commentRepository;
    private final BoardListViewRepository boardListViewRepository;
    private final SearchLogRepository searchLogRepository;

    @Override
    public ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber) {

        GetBoardResultSet resultSet = null;

        List<ImageEntity> imageEntities = new ArrayList<>();

        try {

            resultSet = boardRepository.getBoard(boardNumber);

            if (resultSet == null)

                return GetBoardResponseDto.noExistBoard();

            imageEntities = imageRepository.findByBoardNumber(boardNumber);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseDto.databaseError();
        }

        return GetBoardResponseDto.success(resultSet, imageEntities);
    }

    @Override
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber) {

        List<GetFavoriteListResultSet> resultSets = new ArrayList<>();

        try {

            boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);

            if (!existedBoard)

                return GetFavoriteListResponseDto.noExistBoard();

            resultSets = favoriteRepository.getFavoriteList(boardNumber);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetFavoriteListResponseDto.success(resultSets);
    }

    @Override
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer boardNumber) {

        List<GetCommentListResultSet> resultSets = new ArrayList<>();

        try {

            boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);

            if (!existedBoard)

                return GetCommentListResponseDto.noExistBoard();

            resultSets = commentRepository.getCommentList(boardNumber);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseDto.databaseError();
        }
        return GetCommentListResponseDto.success(resultSets);
    }

    @Override
    public ResponseEntity<? super GetLatestBoardListResponseDto> getLatestBoardList() {

        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {

            boardListViewEntities = boardListViewRepository.findByOrderByWriteDatetimeDesc();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetLatestBoardListResponseDto.success(boardListViewEntities);
    }

    @Override
    public ResponseEntity<? super GetTop3BoardListResponseDto> getTop3BoardList() {

        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {

            Date beforeWeek = Date.from(Instant.now().minus(7, ChronoUnit.DAYS));
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            String sevenDaysAgo = simpleDateFormat.format(beforeWeek);

            boardListViewEntities = boardListViewRepository
                    .findTop3ByWriteDatetimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDatetimeDesc(
                            sevenDaysAgo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetTop3BoardListResponseDto.success(boardListViewEntities);

    }

    @Override
    public ResponseEntity<? super GetSearchBoardListResponseDto> getSearchBoardList(String searchWord,
            String preSearchWord) {

        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {

            boardListViewEntities = boardListViewRepository
                    .findByTitleContainsOrContentContainsOrderByWriteDatetimeDesc(searchWord, searchWord);

            SearchLogEntity searchLogEntity = new SearchLogEntity(searchWord, preSearchWord, false);

            searchLogRepository.save(searchLogEntity);

            boolean relation = preSearchWord != null && !preSearchWord.trim().isEmpty();

            if (relation) {

                searchLogEntity = new SearchLogEntity(preSearchWord, searchWord, relation);
                searchLogRepository.save(searchLogEntity);
            }

        } catch (Exception e) {

            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetSearchBoardListResponseDto.success(boardListViewEntities);

    }

    @Override
    public ResponseEntity<? super GetUserBoardListResponseDto> getUserBoardList(String email) {

        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {

            boolean existedUer = userRepository.existsByEmail(email);

            if (!existedUer)
                return GetUserBoardListResponseDto.noExistUser();

            boardListViewEntities = boardListViewRepository.findByWriterEmailOrderByWriteDatetimeDesc(email);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetUserBoardListResponseDto.success(boardListViewEntities);
    }

    @Override
    public ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email) {

        try {

            boolean existedEmail = userRepository.existsByEmail(email);

            if (!existedEmail)

                return PostBoardResponseDto.notExistUser();

            BoardEntity boardEntity = new BoardEntity(dto, email);

            boardRepository.save(boardEntity);

            int boardNumber = boardEntity.getBoardNumber();

            List<String> boardImageList = dto.getBoardImageList();

            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image : boardImageList) {
                ImageEntity imageEntity = new ImageEntity(boardNumber, image);

                imageEntities.add(imageEntity);
            }

            imageRepository.saveAll(imageEntities);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PostBoardResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer boardNumber,
            String email) {

        try {

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);

            if (boardEntity == null)

                return PostCommentResponseDto.noExistBoard();

            boolean existedUser = userRepository.existsByEmail(email);

            if (!existedUser)

                return PostCommentResponseDto.noExistUser();

            CommentEntity commentEntity = new CommentEntity(dto, boardNumber, email);

            commentRepository.save(commentEntity);

            boardEntity.increaseCommentCount();

            boardRepository.save(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseDto.databaseError();
        }

        return PostCommentResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email) {

        try {

            boolean existedUser = userRepository.existsByEmail(email);

            if (!existedUser)

                return PutFavoriteResponseDto.noExistUser();

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);

            if (boardEntity == null)

                return PutFavoriteResponseDto.noExistBoard();

            FavoriteEntity favoriteEntity = favoriteRepository.findByBoardNumberAndUserEmail(boardNumber, email);

            if (favoriteEntity == null) {

                favoriteEntity = new FavoriteEntity(email, boardNumber);

                favoriteRepository.save(favoriteEntity);

                boardEntity.increaseFavoriteCount();
            } else {

                favoriteRepository.delete(favoriteEntity);
                boardEntity.decreaseFavoriteCount();

            }

            boardRepository.save(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PutFavoriteResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PatchBoardResponseDto> patchBoard(PatchBoardRequestDto dto, Integer boardNumber,
            String email) {

        try {

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);

            if (boardEntity == null)

                return PatchBoardResponseDto.noExistBoard();

            boolean existedUser = userRepository.existsByEmail(email);

            if (!existedUser)

                return PatchBoardResponseDto.noExistUser();

            String writerEmail = boardEntity.getWriterEmail();

            boolean isWriter = writerEmail.equals(email);

            if (!isWriter)

                return PatchBoardResponseDto.noPermission();

            boardEntity.patchBoard(dto);

            boardRepository.save(boardEntity);

            imageRepository.deleteByBoardNumber(boardNumber);

            List<String> boardImageList = dto.getBoardImageList();

            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image : boardImageList) {

                ImageEntity imageEntity = new ImageEntity(boardNumber, image);

                imageEntities.add(imageEntity);
            }

            imageRepository.saveAll(imageEntities);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PatchBoardResponseDto.success();

    }

    @Override
    public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(Integer boardNumber) {

        try {

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null)

                return IncreaseViewCountResponseDto.noExistBoard();
            boardEntity.increaseViewCount();

            boardRepository.save(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return IncreaseViewCountResponseDto.success();
    }

    @Override
    public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(Integer boardNumber, String email) {

        try {

            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser)
                return DeleteBoardResponseDto.noExistUser();

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null)
                return DeleteBoardResponseDto.noExistBoard();

            String writerEmail = boardEntity.getWriterEmail();
            boolean isWriter = writerEmail.equals(email);
            if (!isWriter)
                return DeleteBoardResponseDto.noPermission();

            imageRepository.deleteByBoardNumber(boardNumber);
            commentRepository.deleteByBoardNumber(boardNumber);
            favoriteRepository.deleteByBoardNumber(boardNumber);
            boardRepository.delete(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return DeleteBoardResponseDto.success();
    }
}
