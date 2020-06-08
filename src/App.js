import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, Epic, Tabbar, TabbarItem, Panel, PanelHeader, Alert } from '@vkontakte/vkui';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';
import { platform, IOS } from '@vkontakte/vkui';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28ListLikeOutline from '@vkontakte/icons/dist/28/list_like_outline';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import { WordInfo } from './panels/WordInfo';
import { TopList } from './panels/TopList';
import { MainScreen } from './panels/MainScreen';
import { WordDayService } from './server';
import './panels/style.css';


const osName = platform();

const App = () => {
	const [activeStory, setActiveStory] = useState('word_day');
	const [activePanel, setActivePanel] = useState('word_day');
	const [fetchedUser, setUser] = useState(null);
	const [updatePopout, setUpdatePopout] = useState(<ScreenSpinner/>)
	const [popout, setPopout] = useState(null);
	const [notifications, setNotifications] = useState(0);
	const [dataTop, setDataTop] = useState(null);
	const [itemWord, setItemWord ] = useState(null);
	const [usersTop, setUsersTop ] = useState(null);
	const [wordDay, setwordDay ] = useState({});
	const [count, setCount ] = useState(null);

	const api = new WordDayService();

	useEffect(() => {
		window.addEventListener('popstate', e=>e.preventDefault() & menu(e));
		window.history.pushState({panel: 'word_day'}, `word_day`)
		let searchParams = new URLSearchParams(window.location.search);
			for (let p of searchParams) {
				if(p[0]==="vk_are_notifications_enabled") {
					setNotifications(p[1])
				}
			}
			
			
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			api.getUser(user.id).then(data=>setCount(data.data.correct_count))
			bridge.send("VKWebAppStorageGet", {"keys": ["check"]}).then(data=>{
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
			
		}
		function wordDayOne() {
			    api.getInfo().then(data => {
				setwordDay(data.data.wordDay)
				setDataTop(data.data.top)
				setUpdatePopout(null)
				}).catch(error=>setUpdatePopout(null))
				api.getTop().then(data=>setUsersTop(data))
				

		} 
		fetchData();
		wordDayOne();
		

	},[]);

	 const wordD = () => {
		 api.getInfo().then(data => {
			setwordDay(data.data.wordDay)
			setDataTop(data.data.top);
			setUpdatePopout(null)
			}).catch(error=>setUpdatePopout(null))
		api.getTop().then(data=>setUsersTop(data))
		if(fetchedUser!==null)	{
			api.getUser(fetchedUser.id).then(data=>setCount(data.data.correct_count))
		}
		
		
			
	}

	const go = e => {
		
		setActiveStory(e.currentTarget.dataset.story);
	
		
	};
	const goPanel = (e) => {
		wordD()
		const itemW = dataTop.find(item=>e.currentTarget.dataset.re===item.id)
		setItemWord(itemW);
		setActivePanel(e.currentTarget.dataset.to);
		window.history.pushState({panel: e.currentTarget.dataset.to}, `${e.currentTarget.dataset.to}`)
		
		
		
	};

	const goPanelwordDay = (e) => {
		setActivePanel(e.currentTarget.dataset.to);
		wordD()
		window.history.pushState({panel: e.currentTarget.dataset.to }, `${e.currentTarget.dataset.to}`)
		
	};

	const allowNtifications=()=>{
		bridge.send("VKWebAppAllowNotifications", {})
		.then(data=> {
			setUpdatePopout(<ScreenSpinner/>)
			api.isNotify(1).then(data => {
				setNotifications(1)
				})
			
			setUpdatePopout(null)
		             }
			)
		.catch(error=>setPopout(console.log(error)))
	}

	const popoutWins =(ansewr)=> {
		if(ansewr) {
			setPopout(<Alert
				actionsLayout="vertical"
				actions={[{
				  title: 'Превосходно!',
				  autoclose: true,
				  mode: 'cancel'
				}]}
				onClose={()=>{
					setPopout(null)
				}}
			  >
				<h2>Верно!</h2>
				<p>Вы получаете 3 монеты. Так держать!</p>
			  </Alert>)
		} else {
			setPopout(<Alert
				actionsLayout="vertical"
				actions={[{
				  title: 'Хорошо',
				  autoclose: true,
				  mode: 'cancel'
				}]}
				onClose={()=>{
					setPopout(null)
				}}
			  >
				<h2>Вы не знаете :(</h2>
				<p>К сожалению Вы не получаете монет. Попробуйте другое слово!</p>
			  </Alert>)
		}

	}
	const menu=(e)=> {
		console.log(e.state)
		if(e.state) {
			if(e.state.panel==='word_day') {
				window.history.pushState({panel: 'word_day' }, `word_day`)
				setActivePanel(e.state.panel)
			} else {
				window.history.pushState({panel: 'word_day' }, `word_day`)
				setActivePanel(e.state.panel)
			}
			
		} else {
			setActivePanel(activeStory)
			window.history.pushState({panel: activeStory}, `${activeStory}`)
		}
	}



	return (
		<Epic activeStory={activeStory} tabbar={
			<Tabbar className={activePanel==="2" ? 'tab': ''}>
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
		    <View id="word_day" activePanel={activePanel} popout={updatePopout===null?popout:updatePopout}>
			  <Panel id="word_day">
			     <PanelHeader>Слово дня</PanelHeader>
		         <MainScreen count={count} usersTop={usersTop} goPanelwordDay={goPanelwordDay} fetchedUser={fetchedUser} wordD = {wordD} data = {wordDay} />
			  </Panel>
			  <Panel id="2">
				<PanelHeader left={<PanelHeaderButton onClick={()=>window.history.back()} data-to="word_day">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}>Слово дня</PanelHeader>
				{wordDay && <WordInfo popoutWins={popoutWins} wordD = {wordD} data = {wordDay} notifications={notifications} allowNtifications={allowNtifications} />}
			  </Panel> 
			</View>
			<View id="top_like" activePanel={activePanel} popout={updatePopout===null?popout:updatePopout}>
			  <Panel id="word_day">
				<PanelHeader>Топ 100 слов</PanelHeader>
				  {dataTop && <TopList datatop = {dataTop} goPanel={goPanel} />}
			  </Panel>
			  <Panel id="2">
				<PanelHeader left={<PanelHeaderButton onClick={()=>window.history.back()} data-to="word_day">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}>Топ 100 слов</PanelHeader>
				{itemWord && <WordInfo popoutWins={popoutWins} wordD = {wordD} data = {itemWord} notifications={notifications} allowNtifications={allowNtifications} />}
			  </Panel>
			</View>
	</Epic>

	);
}

export default App;


