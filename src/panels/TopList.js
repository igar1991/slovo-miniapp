import React from 'react';
import {Cell , Div } from '@vkontakte/vkui';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import './style.css';


export const TopList = ({ datatop, goPanel })=> {



    const IconLike =({likes})=> {
        return (
        <div className='todoicon'><Icon24Like/><p className="counttodo">{likes}</p></div>
        )
    }
    

    return (
            <Div>
                {datatop.map(item=><Cell 
                key ={item.id} 
                expandable 
                onClick={goPanel} 
                data-to="top_word" 
                data-re={item.id} 
                before={<IconLike likes={item.likes} />}
                
                 >{item.word}</Cell>)}
            </Div>    
    )
}