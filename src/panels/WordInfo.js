import React, { useState, useEffect } from 'react';
import {View, Epic, Tabbar, TabbarItem, Panel, PanelHeader, Button, Div } from '@vkontakte/vkui';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28NotificationDisableOutline from '@vkontakte/icons/dist/28/notification_disable_outline';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import './style.css';
import bridge from '@vkontakte/vk-bridge';

export const WordInfo = ({ data, notifications, allowNtifications, denyNtifications })=> {

    const [like, setLike] = useState(data.is_likes);
    const [count, setCount] = useState(data.like);

    const shareButton=()=> {
        bridge.send("VKWebAppShowWallPostBox", {"message": `#СловоДня
${data.word}. 
${data.value} 
Узнавай точные значения слов каждый день.👇🏻
https://vk.com/app7442230`});
    }

    const updateLike=()=> {
        setLike(!like);
        if(like) {
            setCount(count-1)
            bridge.send("VKWebAppStorageSet", {"key": "count", "value": "1"});
        } else {
            setCount(count+1)
        }
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
                <Icon24Like onClick={updateLike} />
                :
                <Icon24LikeOutline onClick={updateLike} />
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