import React from 'react';
import {Button, Div } from '@vkontakte/vkui';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import './style.css';
import bridge from '@vkontakte/vk-bridge';

export const WordInfo = ({ data, notifications, allowNtifications, likeOff, likeOn, count, islike })=> {

   
    const shareButton=()=> {
        bridge.send("VKWebAppShowWallPostBox", {"message": `#СловоДня
${data.word}. 
${data.value} 
Узнавай точные значения слов каждый день.👇🏻
https://vk.com/app7442230`});
    }
 

    return (
            <Div className='cardWord'>
				<h1>{data.word}</h1>
				<h4>{data.part}</h4>
				<h3>{data.value}</h3>
				<span>{data.example}</span>
                <div className='iconme'>{
                islike
                ?
                <Icon24Like onClick={()=>likeOff(data.id)} />
                :
                <Icon24LikeOutline onClick={()=>likeOn(data.id)} />
                }
                <p className="count">{count}</p>
                </div>
                {notifications==0 && <Button onClick={allowNtifications} size="xl" stretched mode="secondary" style={{ marginBottom: 8 }} after={<Icon28Notifications width={20} />}>Получать слова</Button>}
                <Button onClick={shareButton} size="xl" stretched mode="commerce" after={<Icon24ShareOutline width={20} />} >Поделиться</Button>
            </Div>    
		
    )
}