import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, Epic, Tabbar, TabbarItem, Panel, PanelHeader, Alert, Div } from '@vkontakte/vkui';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';
import { platform, IOS } from '@vkontakte/vkui';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28ListLikeOutline from '@vkontakte/icons/dist/28/list_like_outline';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import { WordInfo } from './panels/WordInfo';
import { DATA_DAY, DATA_TOP } from './DATA';
import { TopList } from './panels/TopList';

const osName = platform();

const App = () => {
	const [activeStory, setActiveStory] = useState('word_day');
	const [activePanel, setActivePanel] = useState('top_like');
	const [fetchedUser, setUser] = useState(null);
	const [updatePopout, setUpdatePopout] = useState(<ScreenSpinner/>)
	const [popout, setPopout] = useState(null);
	const [itemId, setItemId] = useState(null);
	const [notifications, setNotifications] = useState(false);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			bridge.send("VKWebAppStorageGet", {"keys": ["check"]}).then(data=>{
				console.log(data)
				if(data.keys[0].value==='1') {
					setPopout(null)
				} else {
				setPopout(<Alert
					actionsLayout="vertical"
					actions={[{
					  title: 'Превосходно!',
					  autoclose: true,
					  mode: 'cancel'
					}]}
					onClose={()=>{
						setPopout(null)
						bridge.send("VKWebAppStorageSet", {"key": "check", "value": "1"})
					}}
				  >
					<h2>Слово дня</h2>
					<p>Существует много слов, которые мы часто слышим, но не знаем их точных значений. Каждый день узнавайте точные значения слов русского языка!</p>
				  </Alert>)
				}
				
			})
			setUser(user);
			setUpdatePopout(null)
			
		}
		fetchData();

	}, []);

	const go = e => {
		setActiveStory(e.currentTarget.dataset.story);
	};
	const goPanel = (e) => {
		setItemId(e.currentTarget.dataset.re);
		setActivePanel(e.currentTarget.dataset.to);
	};

	const goBack = e => {
		setActivePanel(e.currentTarget.dataset.to);
	}

	const itemWord = DATA_TOP.find(item=>itemId===item.id);

	const allowNtifications=()=>{
		bridge.send("VKWebAppAllowNotifications", {})
		.then(data=> {
			setUpdatePopout(<ScreenSpinner/>)
			setNotifications(data.result)
			setUpdatePopout(null)
		             }
			)
		.catch(error=>setPopout(<Alert
			actions={[{
			  title: 'Закрыть',
			  autoclose: true,
			  mode: 'cancel'
			}]}
			onClose={()=>setPopout(null)}
		  >
			<h2>Упс...</h2>
			<p>Нам нужно ваше разрешение на отправку уведомлений</p>
		  </Alert>))
	}

	const denyNtifications=()=> {
		bridge.send("VKWebAppDenyNotifications", {})
		.then(data=>{
			setUpdatePopout(<ScreenSpinner/>)
			setNotifications(!data.result)
			setUpdatePopout(null)
		             })
	}


	return (
		<Epic activeStory={activeStory} tabbar={
			<Tabbar>
			  <TabbarItem
				onClick={go}
				selected={activeStory === 'word_day'}
				data-story="word_day"
			  ><Icon28ListAddOutline /></TabbarItem>
			  <TabbarItem
				onClick={go}
				selected={activeStory === 'top_like'}
				data-story="top_like"
			  ><Icon28ListLikeOutline /></TabbarItem>
			</Tabbar>
	}>
		    <View id="word_day" activePanel="word_day" popout={updatePopout===null?popout:updatePopout}>
			  <Panel id="word_day">
			     <PanelHeader>Слово дня</PanelHeader>
		         <WordInfo data = {DATA_DAY} notifications={notifications} allowNtifications={allowNtifications} denyNtifications={denyNtifications} />
			  </Panel> 
			</View>
			<View id="top_like" activePanel={activePanel} popout={updatePopout===null?popout:updatePopout}>
			  <Panel id="top_like">
				<PanelHeader>Топ 100 слов</PanelHeader>
				  <TopList datatop = {DATA_TOP} goPanel={goPanel} />
			  </Panel>
			  <Panel id="top_word">
				<PanelHeader left={<PanelHeaderButton onClick={goBack} data-to="top_like">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}>Топ 100 слов</PanelHeader>
				{itemWord !== null && <WordInfo data = {itemWord} notifications={notifications} allowNtifications={allowNtifications} denyNtifications={denyNtifications} />}
			  </Panel>
			</View>
	</Epic>

	);
}

export default App;


