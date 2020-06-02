import React, {useState, Fragment} from 'react';
import {Group, Header, Cell, Avatar, Spinner, Link, PullToRefresh, SimpleCell} from '@vkontakte/vkui';
import Icon24Coins from '@vkontakte/icons/dist/24/coins';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import './style.css';


export const MainScreen = ({ wordD, data, usersTop, fetchedUser, goPanelwordDay, count })=> {

    const [fetching, setFetching ] = useState(false);  

    const Coin =({num})=><div className='todocoin'><p className="counttodo">{num*3}</p><Icon24Coins fill={'#FFC618'} /></div>
 

    return (
            <>
                 {fetchedUser &&
                <Group header={<Header mode="secondary">Информация о вас</Header>}>
                    <Cell
                        before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
                        
                        description='Колличество монет'
                        indicator={<Coin num={count} />}
                    >
                        {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                    </Cell>
                </Group>} 
                <Group header={<Header mode="secondary">Слово дня</Header>}>
                <Cell 
                expandable 
                onClick={goPanelwordDay} 
                data-to="2" 
                before={<Icon24Favorite fill={'#FFC618'} />}
                
                 >{data.word}</Cell>                    
                </Group>
                <Group 
                header={<Header mode="secondary">Топ пользователей</Header>}
                
                > 
                    
,                    {!usersTop && <Spinner size="large" style={{marginTop: 20, marginBottom: 20}}/>}
                    {usersTop && usersTop.map((item, i) => {
                        return <Link key={i} href={`https://vk.com/id${item.vk_id}`} target="_blank">
                            <SimpleCell
                                description={`${i + 1} место`}
                                before={<Avatar
                                src={item.avatar}
                                />}
                                indicator={<Coin num={item.correct_count} />}
                                >
                                    <Fragment>Вася Иавнов</Fragment>
                            </SimpleCell>
                        </Link>;
                    })}
                </Group>

            </>
		
    )
}