import React, { useState, useEffect } from 'react';
import {Button, Div } from '@vkontakte/vkui';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28NotificationDisableOutline from '@vkontakte/icons/dist/28/notification_disable_outline';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import './style.css';
import bridge from '@vkontakte/vk-bridge';
import { WordDayService } from '../server';

export const WordInfo = ({ data, notifications, allowNtifications, denyNtifications })=> {

    const [like, setLike] = useState(false);
    const [count, setCount] = useState(data.likes);

    const api = new WordDayService();

    const shareButton=()=> {
        bridge.send("VKWebAppShowWallPostBox", {"message": `#СловоДня
${data.word}. 
${data.value} 
Узнавай точные значения слов каждый день.👇🏻
https://vk.com/app7442230`});
    }

    const likeOn =()=> {
        api.like(data.id, true).then(data => {
            console.log(data);
            setLike(true);
            setCount(Number(count)+1)
            })
    }
    const likeOff =()=> {
        api.like(data.id, false).then(data => {
            console.log(data);
            setLike(false);
            setCount(Number(count)-1)
            })
    }
    
 

    return (
            <Div className='cardWord'>
				<h1>{data.word}</h1>
				<h4>{data.part}</h4>
				<h3>{data.value}</h3>
				<span>{data.example}</span>
                <div className='iconme'>{
                like
                ?
                <Icon24Like onClick={likeOff} />
                :
                <Icon24LikeOutline onClick={likeOn} />
                }
                <p className="count">{count}</p>
                </div>
                {!notifications
                ?
                <Button onClick={allowNtifications} size="xl" stretched mode="secondary" style={{ marginBottom: 8 }} after={<Icon28Notifications width={20} />}>Получать слова</Button>
                :
                <Button onClick={denyNtifications} size="xl" stretched mode="destructive" style={{ marginBottom: 8 }} after={<Icon28NotificationDisableOutline width={20} />}>Отключить уведомления</Button>
                }
                <Button onClick={shareButton} size="xl" stretched mode="commerce" after={<Icon24ShareOutline width={20} />} >Поделиться</Button>
            </Div>    
		
    )
}