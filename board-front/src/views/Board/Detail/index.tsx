  import React from 'react';
  import './style.css';
  //Component 게시물 상세화면
  export default function BoardDetail() {

    //Component 게시물 상세 상단
    const BoardDetailTop = () => {

      //Render 
      return (
        <div id='board-detail-top'>
        <div className='board-detail-top-header'>
          <div className='board-detail-title'>{'서울대입구 음식집'}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image'></div>
              <div className='board-detail-writer-nickname'>{'키린'}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>{'2024. 12. 16.'}</div>
            </div>
            <div className='icon-button'>
              <div className='icon more-icon'></div>
            </div>
            <div className='board-detail-more-box'>
              <div className='board-detail-update-button'>{'수정'}</div>
              <div className='divider'></div>
              <div className='board-detail-delete-button'>{'삭제'}</div>
            </div>
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-top-main'>
          <div className='board-detail-main-text'>{'점심메뉴는 부타동!'}</div>
          <div className='board-detail-main-image'></div>
        </div>
      </div>
      )

    }
  //Component 게시물 상세 하단
    const BoardDetailBottom = () => {
      //Render
      return (<></>
        
      )
    }

  //Render
    return (
      <div id='board-detail-wrapper'>
        <div className='board-detail-container'>
          <BoardDetailTop/>
          <BoardDetailBottom/>
        </div>
      </div>
    )
  }
