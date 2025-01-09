import React from 'react';
import './style.css';

//Component Pagination
export default function Pagination() {

//Event handler 페이지 번호 클릭 이벤트
const onPageClickHandler = (page : number) => {

}

//Event handler 이전 클릭 이벤트
const onPreviousClickHandler = () => {

}

//Event handler 다음 클릭 이벤트
const onNextClickHandler = () => {

}

//Render
  return (
    <div id='pagination-wrapper'>
      <div className='pagination-change-link-box'>
        <div className='icon-box-small'>
          <div className='icon expand-left-icon'></div>
        </div>
        <div className='pagination-change-link-text' onClick={onPreviousClickHandler}>{'이전'}</div>
      </div>
      <div className='pagination-divider'>{'\|'}</div>

      <div className='pagination-text-active'>{1}</div>
      <div className='pagination-text' onClick={()=> onPageClickHandler(2)}>{2}</div>

      <div className='pagination-divider'>{'\|'}</div>

      <div className='pagination-change-link-box'>
      <div className='pagination-change-link-text' onClick={onNextClickHandler}>{'다음'}</div>
        <div className='icon-box-small'>
          <div className='icon expand-right-icon'></div>
        </div>
      </div>

    </div>
  )
}
