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
import { WordDayService } from './server';
import './panels/style.css';


const osName = platform();

const App = () => {
	const [activeStory, setActiveStory] = useState('word_day');
	const [activePanel, setActivePanel] = useState('top_like');
	const [fetchedUser, setUser] = useState(null);
	const [updatePopout, setUpdatePopout] = useState(<ScreenSpinner/>)
	const [popout, setPopout] = useState(null);
	const [notifications, setNotifications] = useState(0);
	const [dataTop, setDataTop] = useState(null);
	const [itemWord, setItemWord ] = useState(null);
	const [wordDay, setwordDay ] = useState({});
	const [count, setCount ] = useState(null);
    const [islike, setIsLike ] = useState(null);
	


	const api = new WordDayService();

	useEffect(() => {
		window.addEventListener('popstate', e=>e.preventDefault() & menu(e));
		window.history.pushState({panel: 'top_like'}, `top_like`)
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
				setCount(data.data.wordDay.likes)
				setIsLike(data.data.wordDay.is_likes)
				setDataTop(data.data.top)
				setUpdatePopout(null)
				}).catch(error=>setUpdatePopout(null))
				

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
			
	}

	const go = e => {
		setActiveStory(e.currentTarget.dataset.story);
		if(activeStory === 'top_like') {
			setCount(wordDay.likes);
		    setIsLike(wordDay.is_likes);
		}
		
	};
	const goPanel = (e) => {
		wordD()
		const itemW = dataTop.find(item=>e.currentTarget.dataset.re===item.id)
		setItemWord(itemW);
		setCount(itemW.likes);
		setIsLike(itemW.is_likes);
		setActivePanel(e.currentTarget.dataset.to);
		
	};

	const goBack = e => {
		setActivePanel(e.currentTarget.dataset.to);
		window.history.pushState({panel: e.currentTarget.dataset.to }, `${e.currentTarget.dataset.to}`)
	}

	const menu=(e)=> {
		if(e.state) {
			setActivePanel(e.state.panel)
		} else {
			setActivePanel('top_like')
			window.history.pushState({panel: 'top_like'}, `top_like`)
		}
	}

	const allowNtifications=()=>{
		bridge.send("VKWebAppAllowNotifications", {})
		.then(data=> {
			setUpdatePopout(<ScreenSpinner/>)
			api.isNotify(1).then(data => {
				setNotifications(1)
				console.log(data);
				})
			
			setUpdatePopout(null)
		             }
			)
		.catch(error=>setPopout(console.log(error)))
	}

	const likeOn =(id)=> {
        setCount(Number(count)+1)
        setIsLike(!islike)
        api.like(id, true).then(data => {
            wordD()
            })
	}
	const likeOff =(id)=> {
		setCount(Number(count)-1)
		setIsLike(!islike)
        api.like(id, false).then(data => {
            wordD()
            })
	}
	


	return (
		<Epic activeStory={activeStory} tabbar={
			<Tabbar className={activePanel==="top_word" ? 'tab': ''}>
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
		         <WordInfo likeOn = {likeOn} likeOff={likeOff} count={count} islike={islike} data = {wordDay} notifications={notifications} allowNtifications={allowNtifications}  />
			  </Panel> 
			</View>
			<View id="top_like" activePanel={activePanel} popout={updatePopout===null?popout:updatePopout}>
			  <Panel id="top_like">
				<PanelHeader>Топ 100 слов</PanelHeader>
				  <TopList datatop = {dataTop} goPanel={goPanel} />
			  </Panel>
			  <Panel id="top_word">
				<PanelHeader left={<PanelHeaderButton onClick={()=>window.history.back()} data-to="top_like">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}>Топ 100 слов</PanelHeader>
				{itemWord !== null && <WordInfo likeOn={likeOn} likeOff={likeOff} count={count} islike={islike} data = {itemWord} notifications={notifications} allowNtifications={allowNtifications} />}
			  </Panel>
			</View>
	</Epic>

	);
}

export default App;


