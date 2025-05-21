import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { on } from 'events';
import { SEARCH_PATH } from 'constants/index';
import Pagination from 'components/Pagination';

//Component 게시물 검색 화면
export default function Search() {

  //State : searchWord path variable
  const { searchWord} = useParams();

  //State : 검색 게시물 개수 상태
  const [count, setCount] = useState<number>(0);

  //State : 검색 게시물 리스트
  const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);

  //State : 관련 검색어 리스트
  const [relationList, setRelationList] = useState<string[]>([]);

  //Function : Navigate
  const navigate = useNavigate();

  //Event Handler : 연관 검색어 클릭 이벤트
  const onRelationWordClickHandler = (word: string) => {
    navigate(SEARCH_PATH(word));
  }


  //Effect : 첫 마운트 시 실행
  useEffect(() => {
    setSearchBoardList(latestBoardListMock);
    setRelationList([]);
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
                <div className='search-contents'>{searchBoardList.map((boardListItem) => <BoardItem boardListItem={boardListItem}/>)}</div>
            }
              <div className='search-relation-box'>
                <div className='search-relation-card'>
                  <div className='search-relation-card-container'>
                    <div className='search-relation-card-title'>{'관련 검색어'}</div>
                    {relationList.length === 0 ?
                    <div className='search-relation-card-contents-nothing'>{'관련 검색어가 없습니다.'}</div> :
                    <div className='search-relation-card-contents'>
                      {relationList.map(word => <div className='word-badge' onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                    </div>
                    }
                    </div>
                </div>
              </div>
          </div>
          <div className='search-pagination-box'>
            {count !== 0 && {/* <Pagination/> */}}
          </div>
        </div>
      </div>
  )
}
