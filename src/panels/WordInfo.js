import React, {useState} from 'react';
import {Button, Div, Group, Header } from '@vkontakte/vkui';
import Icon24LikeOutline from '@vkontakte/icons/dist/24/like_outline';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import './style.css';
import bridge from '@vkontakte/vk-bridge';
import { WordDayService } from '../server';


export const WordInfo = ({ data, notifications, allowNtifications, wordD, popoutWins })=> {

    const api = new WordDayService();
    const [count, setCount] = useState(data.likes);
    const [islike, setIslike] = useState(data.is_likes);
    const [isanswered, setIsanswered] = useState(data.is_answered);
  

    const likeOn =()=> {
        setCount(Number(count)+1)
        setIslike(!islike)
        api.like(data.id, true).then(data => {
            wordD()
            })
    }
    
    const likeOff =()=> {
        setCount(Number(count)-1)
        setIslike(!islike)
        api.like(data.id, false).then(data => {
            wordD()
            })
    }

    const postAnswer =(wid, aid)=>{
        api.answer(wid,aid).then(data=>popoutWins(data.data.is_correct))
        setIsanswered(true)
        wordD()
    }
    
    const shareButton=()=> {
        bridge.send("VKWebAppShowWallPostBox", {"message": `#СловоДня
${data.word}. 
${data.value} 
Узнавай точные значения слов каждый день.👇🏻
https://vk.com/app7442230`});
    }

    const FullWord =()=> {
        return (
            data!==null&& <>
            <h3>{data.value}</h3>
				<span>{data.example}</span>
                <div className='iconme'>{
                islike
                ?
                <Icon24Like onClick={likeOff} />
                :
                <Icon24LikeOutline onClick={likeOn} />
                }
                <p className="count">{count}</p>
                </div>
                {notifications==0 && <Button onClick={allowNtifications} size="xl" stretched mode="secondary" style={{ marginBottom: 8 }} after={<Icon28Notifications width={20} />}>Получать слова</Button>}
                <Button onClick={shareButton} size="xl" stretched mode="commerce" after={<Icon24ShareOutline width={20} />} >Поделиться</Button>
                </>
        )
    }

    const QwestionsWord =()=> {
        return (
            data!==null&&<>
            <Group>
            <Header mode="secondary">Что означает это слово?</Header>
            {data.questions_json!==undefined&&data.questions_json.map(item=><Button key={item.id} style={{ marginBottom: '1em' }} size="xl" mode="outline" onClick={()=>postAnswer(data.id, item.id)}>{item.quest}</Button>)}
            {data.questions_json!==undefined&&<Button style={{ marginBottom: '1em' }} size="xl" mode="outline" onClick={()=>postAnswer(data.id, 10)}>Я не знаю :(</Button>}
            </Group>

            </>
        )
    }

    return (
            <Div className='cardWord'>
				<h1>{data.word}</h1>
				<h4>{data.part}</h4>
                {isanswered ? <FullWord /> : <QwestionsWord />}
            </Div>    
		
    )
}