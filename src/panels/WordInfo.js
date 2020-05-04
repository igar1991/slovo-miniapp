import React from 'react';
import {View, Epic, Tabbar, TabbarItem, Panel, PanelHeader, Button, Div } from '@vkontakte/vkui';
import Icon28LikeOutline from '@vkontakte/icons/dist/28/like_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import './style.css';

export const WordInfo = ({ data })=> {
    return (
            <Div className='cardWord'>
				<h1>{data.word}</h1>
				<h4>{data.part}</h4>
				<h3>{data.value}</h3>
				<span>{data.example}</span>
				<div className='iconme'><Icon28LikeOutline /><p className="count">{data.like}</p></div>
                  <Button size="xl" stretched mode="secondary" style={{ marginBottom: 8 }} after={<Icon28Notifications width={20} />}>Получать слова</Button>
                  <Button size="xl" stretched mode="commerce" after={<Icon24ShareOutline width={20} />} >Поделиться</Button>
            </Div>    
		
    )
}