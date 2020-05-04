import React from 'react';
import {Cell , Div } from '@vkontakte/vkui';
import Icon24Like from '@vkontakte/icons/dist/24/like';

export const TopList = ({ datatop, goPanel })=> {

    return (
            <Div>
                {datatop.map(item=><Cell 
                key ={item.id} 
                expandable 
                description={item.like}
                onClick={goPanel} 
                data-to="top_word" 
                data-re={item.id} 
                before={<Icon24Like/>}
                
                 >{item.word}</Cell>)}
            </Div>    
    )
}