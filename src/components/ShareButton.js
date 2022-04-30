import React, {useState} from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";


import './CSS/btnShare.css';

const ShareButton = ({meetingID}) => {

  const message = `Hey, your meeting link is ${meetingID}`;
  const url = 'https://hiredco.herokuapp.com';
  const title = 'Your interview is ready.';
  const hashtag = ['letsDoIt'];

  return(
    <div className='link-share'>

      <div className='social-container'>

        <h5 className='font-main orange'>SHARE WITH : </h5>

        <WhatsappShareButton url={url} title={message}>
          <i class="fa-brands fa-whatsapp ml-3 share-icon"></i>
        </WhatsappShareButton>

        <FacebookShareButton url={url} quote={message} hashtag={hashtag}>
          <i class="fa-brands fa-facebook ml-3 share-icon"></i>
        </FacebookShareButton>

        {
          /*
          
        <LinkedinShareButton title={title} summary={message} source={url}>
          <LinkedinIcon size={32} round={true}></LinkedinIcon>
        </LinkedinShareButton>
        
        <TwitterShareButton title={title} via={message} hashtag={hashtag}>
          <TwitterIcon size={32} round={true}></TwitterIcon>
        </TwitterShareButton>

        <TelegramShareButton title={message}>
          <TelegramIcon size={32} round={true}></TelegramIcon>
        </TelegramShareButton>
          
          */
        }

        <EmailShareButton subject={title} url={url} body={message}>
          <i class="fa-solid fa-envelope ml-3 share-icon"></i>
        </EmailShareButton>
        
      </div>
    </div>
  );
}

export default ShareButton;