package com.myblog.board_back.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.myblog.board_back.dto.response.ResponseDto;
import com.myblog.board_back.dto.response.search.GetPopularListResponseDto;
import com.myblog.board_back.dto.response.search.GetRelationListResponseDto;
import com.myblog.board_back.repository.SearchLogRepository;
import com.myblog.board_back.repository.resultSet.GetPopularListResultSet;
import com.myblog.board_back.repository.resultSet.GetRelationListResultSet;
import com.myblog.board_back.service.SearchService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SearchServiceImplement implements SearchService {

    private final SearchLogRepository searchLogRepository;

    @Override
    public ResponseEntity<? super GetPopularListResponseDto> getPopularList() {

        List<GetPopularListResultSet> resultSets = new ArrayList<>();

        try {

            resultSets = searchLogRepository.getPopularList();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetPopularListResponseDto.success(resultSets);

    }

    @Override
    public ResponseEntity<? super GetRelationListResponseDto> getRelationList(String searchWord) {

        List<GetRelationListResultSet> resultSets = new ArrayList<>();

        try {

            resultSets = searchLogRepository.getRelationList(searchWord);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetRelationListResponseDto.success(resultSets);
    }

}
