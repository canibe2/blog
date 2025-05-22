import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { on } from 'events';
import { SEARCH_PATH } from 'constants/index';
import Pagination from 'components/Pagination';
import { getRelationListRequest, getSearchBoardListRequest } from 'apis';
import { GetSearchBoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { usePagination } from 'hooks';
import { GetRelationListResponseDto } from 'apis/response/search';

//Component 게시물 검색 화면
export default function Search() {

  //State : searchWord path variable
  const { searchWord} = useParams();
  
  //State : 페이지네이션 관련
  const { currentPage, currentSection, viewList, viewPageList, totalSection,
    setCurrentPage, setCurrentSection, setTotalList} = usePagination<BoardListItem>(5);

  //State : 이전 검색어
  const [preSearchWord, setPreSearchWord] = useState<string | null>(null);

  //State : 검색 게시물 개수 상태
  const [count, setCount] = useState<number>(0);

/*   //State : 검색 게시물 리스트
  const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]); */

  //State : 관련 검색어 리스트
  const [relationWordList, setRelationWordList] = useState<string[]>([]);

  //Function : Navigate
  const navigate = useNavigate();

  //Function : get search board list response
  const getSearchBoardListResponse = (responseBody : GetSearchBoardListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
  
  const { code } = responseBody;
  if ( code === 'DBE') alert("데이터베이스 오류입니다.");
  if ( code !== 'SU') return;
  
  if(!searchWord) return;
  const { searchList } = responseBody as GetSearchBoardListResponseDto;
  setTotalList(searchList);
  setCount(searchList.length);
  setPreSearchWord(searchWord);
  }

  //Function : get relation list response
  const getRelationListResponse = (responseBody : ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if ( code === 'DBE') alert("데이터베이스 오류입니다.");
    if ( code !== 'SU') return;

    const { relationWordList = []} = responseBody as GetRelationListResponseDto;
    setRelationWordList(relationWordList);
  };

  //Event Handler : 연관 검색어 클릭 이벤트
  const onRelationWordClickHandler = (word: string) => {
    navigate(SEARCH_PATH(word));
  };


  //Effect : search word 상태 변경 시 실행
  useEffect(() => {
  if(!searchWord) return;
  getSearchBoardListRequest(searchWord,preSearchWord).then(getSearchBoardListResponse);
  getRelationListRequest(searchWord).then(getRelationListResponse);
  }, [searchWord]);


  //Render
  if(!searchWord) return(<></>);
  return (
    <div id='search-wrapper'>
        <div className='search-container'>
          <div className='search-title-box'>
            <div className='search-title'><span className='search-title-emphasis'>{searchWord}</span>{'에 대한 검색결과'}</div>
            <div className='search-count'>{count}</div>
          </div>
          <div className='search-contents-box'>
            {count === 0 ?
                <div className='search-contents-nothing'>{'검색 결과가 없습니다.'}</div> :
                <div className='search-contents'>{viewList.map((boardListItem) => <BoardItem boardListItem={boardListItem}/>)}</div>
            }
              <div className='search-relation-box'>
                <div className='search-relation-card'>
                  <div className='search-relation-card-container'>
                    <div className='search-relation-card-title'>{'관련 검색어'}</div>
                    {relationWordList.length === 0 ?
                    <div className='search-relation-card-contents-nothing'>{'관련 검색어가 없습니다.'}</div> :
                    <div className='search-relation-card-contents'>
                      {relationWordList.map(word => <div className='word-badge' onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                    </div>
                    }
                    </div>
                </div>
              </div>
          </div>
          <div className='search-pagination-box'>
            {count !== 0 && <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
            />}
          </div>
        </div>
      </div>
  )
}
