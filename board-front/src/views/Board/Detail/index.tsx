  import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
  import './style.css';
import FavoriteItem from 'components/FavoriteItem';
import { Board, CommentListItem, FavoriteListItem } from 'types/interface';
import { commentListMock, favoriteListMock } from 'mocks';
import CommentItem from 'components/CommentItem';
import Pagination from 'components/Pagination';
import DefaultProfileImage from 'assets/image/default-profile-image.png';
import { useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from 'constants/index';
import { getBoardRequest, increaseViewCountRequest } from 'apis';
import GetBoardResponseDto from 'apis/response/board/get-board.response.dto';
import { ResponseDto } from 'apis/response';
import { IncreaseViewCountResponseDto } from 'apis/response/board';
  //Component 게시물 상세화면
  export default function BoardDetail() {

    //State 게시물 번호 path variable
    const {boardNumber} = useParams();
    //State  로그인 유저
    const {loginUser} = useLoginUserStore();

    //Function 네비게이트
    const navigator = useNavigate();

    //Function increase view count response
    const increaseViewCountResponse = (responseBody : IncreaseViewCountResponseDto | ResponseDto | null) => {
      if(!responseBody)
        return;
      const { code }  = responseBody;
      if(code === 'NB')
        alert('존재하지 않는 게시물입니다.');
      if(code === 'DBE')
        alert('데이터베이스 오류입니다.');
    }

    //Component 게시물 상세 상단
    const BoardDetailTop = () => {

    //State 작성자 여부
    const [isWriter, setWriter] = useState<boolean>(false);

    //State more button
    const [board, setBoard] = useState<Board | null>(null);

    //State more button
    const [showMore, setShowMore] = useState<boolean>(false);

    //Function get board response
    const getBoardResponse = (responseBody : GetBoardResponseDto | ResponseDto | null) => {
      if(!responseBody)
        return;

      const  { code } = responseBody;

      if(code === 'NU')
        alert("존재하지 않는 게시물입니다.");
      if(code === 'DBE')
        alert("데이터베이스 오류입니다.");
      if(code !== 'SU') {
        navigator(MAIN_PATH());
        return;
    }
    
    const board : Board = {...responseBody as GetBoardResponseDto};
    setBoard(board);

    if(!loginUser) {
      setWriter(false);
      return;
    }
    const isWriter = loginUser.email == board.writerEmail;
    setWriter(isWriter);
    }

    //Event handler : nickname click
    const onNicknameClickHandler = () => {
      if(!board)

        return;

      navigator(USER_PATH(board.writerEmail));
    }

     //Event handler : more button click
    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    }

    //Event handler : modify update button click
    const onUpdateButtonClickHandler = () => {
      if(!board || !loginUser)

        return;

        if(loginUser.email !== board.writerEmail)

        return;

        navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardNumber));
    }

    //Event handler : delete button click
    const onDeleteButtonClickHanlder = () => {

      if(!board || !loginUser)

        return;

        if(loginUser.email !== board.writerEmail)

        return;

        //TODO : Delete Request 

        navigator(MAIN_PATH());

    }

    //Effect 게시물 번호 path variable 바뀔때마다 게시물 불러오기
    useEffect(() => {
      if(!boardNumber){
        navigator(MAIN_PATH());
        return;
      }
      getBoardRequest(boardNumber).then(getBoardResponse);
    },[boardNumber]);

    
    //Render 
    if(!board) return <></>;

      return (
        <div id='board-detail-top'>
        <div className='board-detail-top-header'>
          <div className='board-detail-title'>{board.title}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image' style={{backgroundImage : `url(${board.writerProfileImage ? board.writerProfileImage : DefaultProfileImage})`}}></div>
              <div className='board-detail-writer-nickname' onClick={onNicknameClickHandler}>{board.writerNickname}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>{board.writeDatetime}</div>
            </div>
            {isWriter &&
            <div className='icon-button' onClick={onMoreButtonClickHandler}>
              <div className='icon more-icon'></div>
            </div>
            }
            {showMore &&
            <div className='board-detail-more-box'>
              <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
              <div className='divider'></div>
              <div className='board-detail-delete-button' onClick={onDeleteButtonClickHanlder}>{'삭제'}</div>
            </div>
            }
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-top-main'>
          <div className='board-detail-main-text'>{board.content}</div>
          {board.boardImageList.map(image => <img className='board-detail-main-image' src={image}/>)}
          
        </div>
      </div>
      )

    }
  //Component 게시물 상세 하단
    const BoardDetailBottom = () => {

      //State 댓글 textarea 참조
      const commentRef = useRef<HTMLTextAreaElement | null>(null);
      //State 좋아요 리스트
      const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
      //State 댓글 리스트
      const [commentList, setCommentList] = useState<CommentListItem[]>([]);
      //State 좋아요 상태
      const [isFavorite, setFavorite] = useState<boolean>(false);
      //State 좋아요 보기
      const [showFavorite, setShowFavorite] = useState<boolean>(false);
       //State 댓글 보기
      const [showComment, setShowComment] = useState<boolean>(false);
       //State 댓글
      const [comment, setComment] = useState<string>('');

      //Event handler 좋아요 클릭
      const onFavoriteClickHandler = () =>{
        setFavorite(!isFavorite);
      }
      //Event handler 좋아요 보기 클릭
      const onShowFavoriteClickHandler = () =>{
        setShowFavorite(!showFavorite);
      }
      //Event handler 댓글 보기 클릭
      const onShowCommentClickHandler = () =>{
        setShowComment(!showComment);
      }
      //Event handler 댓글 작성 버튼 클릭
      const onCommentSubmitButtonClickHandler = () => {

        if(!comment)

          return;
          alert('!');

      }
       //Event handler 댓글 변경
      const onCommentChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) =>{
        const {value} = event.target;
        setComment(value);
        if(!commentRef.current)

          return;

          commentRef.current.style.height = 'auto';
          commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;

      }



      //Effect 게시물 번호 path variable 바뀔때 마다 좋아요,댓글 리스트 불러오기
      useEffect(() => {
        setFavoriteList(favoriteListMock);
        setCommentList(commentListMock);

      },[boardNumber]);

      //Render 하단 
      return (
        <div id='board-detail-bottom'>
          <div className='board-detail-bottom-button-box'>
            <div className='board-detail-bottom-button-group'>
              <div className='icon-button' onClick={onFavoriteClickHandler}>
                {isFavorite ?
              <div className='icon favorite-fill-icon'></div> :
              <div className='icon favorite-light-icon'></div>
              }
              </div>
              <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList.length}`}</div>
              <div className='icon-button' onClick={onShowFavoriteClickHandler}>
                {showFavorite ?
                <div className='icon up-light-icon'></div> :
                <div className='icon down-light-icon'></div>
                }
              </div>
            </div>
              <div className='board-detail-bottom-button-group'>
              <div className='icon-button'>
                <div className='icon comment-icon'></div>
              </div>
              <div className='board-detail-bottom-button-text'>{`댓글 ${commentList.length}`}</div>
              <div className='icon-button' onClick={onShowCommentClickHandler}>
                {showComment ?
                <div className='icon up-light-icon'></div> :
                <div className='icon down-light-icon'></div>
                }
              </div>
            </div>
          </div>
          {showFavorite && 
          <div className='board-detail-bottom-favorite-box'>
            <div className='board-detail-bottom-favorite-container'>
              <div className='board-detail-bottom-favorite-title'>{'좋아요 '}<span className='emphasis'>{favoriteList.length}</span></div>
              <div className='board-detail-bottom-favorite-contents'>
                {favoriteList.map(item => <FavoriteItem favoriteListItem={item}/>)}
              </div>
            </div>
          </div>
          }
          {showComment &&
          <div className='board-detail-bottom-comment-box'>
            <div className='board-detail-bottom-comment-container'>
              <div className='board-detail-bottom-comment-title'>{'댓글 '}<span className='emphasis'>{commentList.length}</span></div>
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
              <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler}/>
              <div className='board-detail-bottom-comment-button-box'>
                <div className={comment === '' ? 'disable-button' : 'black-button'} onClick={onCommentSubmitButtonClickHandler}>{'댓글달기'}</div>
              </div>
            </div>
          </div>
        </div>
          }
        </div>
        
      )
    }

    //Effect 게시물 번호 path variable이 바뀔때 마다 게시물 조회수 증가
    let effectFlag = true;

    useEffect(() => {
      if(!boardNumber)
        return;

      if(effectFlag){
        effectFlag = false;
        return;
      }
      increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);
    },[boardNumber]);

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
