import React from 'react';
import { FavoriteListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import './style.css';

interface Props {
    favoriteListItem : FavoriteListItem;
}

// component : Favorite List Item
export default function FavoriteItem({favoriteListItem} : Props) {

    //Props
    const {profileImage,nickname} = favoriteListItem;
   //render 
  return (
    <div className='favorite-list-item'>

        <div className='favorite-list-item-profile-box'>
            <div className='favorite-list-item-profile-image' style={{backgroundImage : `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
        </div>
        <div className='favorite-list-item-profile-nickname'>{'김치만두'}</div>
    </div>
  )
}
