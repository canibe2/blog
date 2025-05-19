import React, { useEffect, useState } from 'react';
import './style.css';
import { Board, BoardListItem } from 'types/interface';
import { latestBoardListMock, top3BoardListMock } from 'mocks';
import Top3Item from 'components/Top3Item';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { useNavigate } from 'react-router-dom';
import { SEARCH_PATH } from 'constants/index';
import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'apis';
import { GetLatestBoardListResponseDto, GetTop3BoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { usePagination } from 'hooks';
import { GetPopularListResponseDto } from 'apis/response/search';

//Component 메인화면
export default function Main() {

//Component : 상단
const MainTop = () => {

  //State : 주간 top3 게시물 리스트
  const [top3BoardList,setTop3BoardList] = useState<BoardListItem[]>([]);

  //Function : get Top3 board list reponse
  const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !=='SU') return;

    const { top3List} = responseBody as GetTop3BoardListResponseDto;
    setTop3BoardList(top3List);
  }

  //Effect : 첫 마운트 시 실행될 함수
  useEffect(() => {
    getTop3BoardListRequest().then(getTop3BoardListResponse);
  }, []);


  return (
    <div id='main-top-wrapper'>
      <div className='main-top-container'>
        <div className='main-top-title'>{'BLOG'}</div>
        <div className='main-top-contents-box'>
          <div className='main-top-contents-title'>{'주간 TOP 3 게시글'}</div>
          <div className='main-top-contents'>
            {top3BoardList.map(top3ListItem => <Top3Item top3ListItem={top3ListItem}/>)}
          </div>
        </div>
      </div>
    </div>
  );
};

//Component : 하단
const MainBottom = () => {

  //Function : Navigate
  const navigate = useNavigate();

/*//State : 최신 게시물 리스트
  const [currentBoardList,setCurrentBoardList] = useState<BoardListItem[]>([]); */

  //State : 페이지네이션 관련
  const { currentPage, currentSection, viewList, viewPageList, totalSection, setCurrentPage, setCurrentSection, setTotalList} = usePagination<BoardListItem>(5);

  //State : 인기 검색어 리스트
  const [popularWordList,setPopularWordList] = useState<string[]>([]);

  //Function : get latest board list response
  const getLatestBoardListReponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !=='SU') return;

    const { latestList} = responseBody as GetLatestBoardListResponseDto;
    setTotalList(latestList);
  };

  //Function : get popular list response
  const getPopularListReponse = (responseBody: GetPopularListResponseDto |ResponseDto | null) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if(code === 'DBE') alert('데이터베이스 오류입니다.');
  if(code !=='SU') return;

  const { popularWordList} = responseBody as GetPopularListResponseDto;
  setPopularWordList(popularWordList);
  }
  //Event Handler : 인기 검색어 클릭 이벤트
    const onPopularWordClickHandler = (word:string) => {
    navigate(SEARCH_PATH(word));
    };

  //Effect : 첫 마운트 시 실행될 함수
  useEffect(() => {
    /* setCurrentBoardList(latestBoardListMock); */
    getLatestBoardListRequest().then(getLatestBoardListReponse);
    getPopularListRequest().then(getPopularListReponse);
  }, []);
  return (
    <div id='main-bottom-wrapper'>
      <div className='main-bottom-container'>
        <div className='main-bottom-title'>{'최신 게시물'}</div>
        <div className='main-bottom-contents-box'>
          <div className='main-bottom-current-contents'>
          {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
          </div>
          <div className='main-bottom-popular-box'>
            <div className='main-bottom-popular-card'>
              <div className='main-bottom-popular-card-box'>
                <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                <div className='main-bottom-popular-card-contents'>
                  {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='main-bottom-pagination-box'>
          <Pagination
            currentPage={currentPage}
            currentSection={currentSection}
            setCurrentPage={setCurrentPage}
            setCurrentSection={setCurrentSection}
            viewPageList={viewPageList}
            totalSection={totalSection}
          />
        </div>
    </div>
  </div>
  );
};
  //Render
  return (
    <>
    <MainTop />
    <MainBottom/>
    </>
  )
}
