import React, { useEffect, useState } from 'react';
import './style.css';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock, top3BoardListMock } from 'mocks';
import Top3Item from 'components/Top3Item';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { useNavigate } from 'react-router-dom';
import { SEARCH_PATH } from 'constants/index';

//Component 메인화면
export default function Main() {

//Component : 상단
const MainTop = () => {

  //State : 주간 top3 게시물 리스트
  const [top3BoardList,setTop3BoardList] = useState<BoardListItem[]>([]);

  //Effect : 첫 마운트 시 실행될 함수
  useEffect(() => {
    setTop3BoardList(top3BoardListMock)
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

  //State : 최신 게시물 리스트
  const [currentBoardList,setCurrentBoardList] = useState<BoardListItem[]>([]);
  //State : 인기 검색어 리스트
  const [popularWordList,setPopularWordList] = useState<string[]>([]);
  
    //Event Handler : 인기 검색어 클릭 이벤트
    const onPopularWordClickHandler = (word:string) => {
      navigate(SEARCH_PATH(word));
    }

  //Effect : 첫 마운트 시 실행될 함수
  useEffect(() => {
    setCurrentBoardList(latestBoardListMock);
    setPopularWordList(['하이', '바이', '끼룩']);
  }, []);
  return (
    <div id='main-bottom-wrapper'>
      <div className='main-bottom-container'>
        <div className='main-bottom-title'>{'최신 게시물'}</div>
        <div className='main-bottom-contents-box'>
          <div className='main-bottom-current-contents'>
          {currentBoardList.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
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
          {/* <Pagination/> */}
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
