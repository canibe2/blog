  import React, { useEffect, useState } from 'react';
  import './style.css';
import FavoriteItem from 'components/FavoriteItem';
import { CommentListItem, FavoriteListItem } from 'types/interface';
import { commentListMock, favoriteListMock } from 'mocks';
import CommentItem from 'components/CommentItem';
import Pagination from 'components/Pagination';
import DefaultProfileImage from 'assets/image/default-profile-image.png';
  //Component 게시물 상세화면
  export default function BoardDetail() {

    //Component 게시물 상세 상단
    const BoardDetailTop = () => {

    //State more button
    const [showMore, setShowMore] = useState<boolean>(false);

    //Event handler : more button click
    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    }

      //Render 
      return (
        <div id='board-detail-top'>
        <div className='board-detail-top-header'>
          <div className='board-detail-title'>{'서울대입구 음식집'}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image' style={{backgroundImage : `url(${DefaultProfileImage})`}}></div>
              <div className='board-detail-writer-nickname'>{'키린'}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>{'2024. 12. 16.'}</div>
            </div>
            <div className='icon-button' onClick={onMoreButtonClickHandler}>
              <div className='icon more-icon'></div>
            </div>
            {showMore &&
            <div className='board-detail-more-box'>
              <div className='board-detail-update-button'>{'수정'}</div>
              <div className='divider'></div>
              <div className='board-detail-delete-button'>{'삭제'}</div>
            </div>
            }
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-top-main'>
          <div className='board-detail-main-text'>{'테일윈드 사용 해보고 싶습니다!'}</div>
          <img className='board-detail-main-image' src='https://miro.medium.com/v2/resize:fit:828/format:webp/1*__f27S-qQF2CAASt5bOwqg.png'></img>
        </div>
      </div>
      )

    }
  //Component 게시물 상세 하단
    const BoardDetailBottom = () => {

      const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);

      const [commentList, setCommentList] = useState<CommentListItem[]>([]);

      useEffect(() => {
        setFavoriteList(favoriteListMock);
        setCommentList(commentListMock);

      },[]);

      //Render 하단 
      return (
        <div id='board-detail-bottom'>
          <div className='board-detail-bottom-button-box'>
            <div className='board-detail-bottom-button-group'>
              <div className='icon-button'>
                <div className='icon favorite-fill-icon'></div>
              </div>
              <div className='board-detail-bottom-button-text'>{`좋아요 ${12}`}</div>
              <div className='icon-button'>
                <div className='icon up-light-icon'></div>
              </div>
            </div>
              <div className='board-detail-bottom-button-group'>
              <div className='icon-button'>
                <div className='icon comment-icon'></div>
              </div>
              <div className='board-detail-bottom-button-text'>{`댓글 ${12}`}</div>
              <div className='icon-button'>
                <div className='icon up-light-icon'></div>
              </div>
            </div>
          </div>
          <div className='board-detail-bottom-favorite-box'>
            <div className='board-detail-bottom-favorite-container'>
              <div className='board-detail-bottom-favorite-title'>{'좋아요 '}<span className='emphasis'>{12}</span></div>
              <div className='board-detail-bottom-favorite-contents'>
                {favoriteList.map(item => <FavoriteItem favoriteListItem={item}/>)}
              </div>
            </div>
          </div>
          <div className='board-detail-bottom-comment-box'>
            <div className='board-detail-bottom-comment-container'>
              <div className='board-detail-bottom-comment-title'>{'댓글 '}<span className='emphasis'>{12}</span></div>
              <div className='board-detail-bottom-comment-list-container'>
                {commentList.map(item => <CommentItem commentListItem={item}/>)}
              </div>
            </div>
            <div className='divider'></div>
            <div className='board-detail-bottom-comment-pagination-box'>
              <Pagination/>
            </div>
            <div className='board-detail-bottom-comment-input-box'>
            <div className='board-detail-bottom-comment-input-container'>
              <textarea className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.'/>
              <div className='board-detail-bottom-comment-button-box'>
                <div className='disable-button'>{'댓글달기'}</div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
      )
    }

  //Render 상세
    return (
      <div id='board-detail-wrapper'>
        <div className='board-detail-container'>
          <BoardDetailTop/>
          <BoardDetailBottom/>
        </div>
      </div>
    )
  }
