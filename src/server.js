export class WordDayService {
    constructor(vkAppUrl = null) {
        this.actionServer = 'https://testeron.pro/word-day/';
        if (vkAppUrl) {
            this.vkAppUrl = vkAppUrl;
        } else {
            this.vkAppUrl = window.location.href;
        }
    }

    async post(url, formData = null) {
        if (!formData) {
            formData = new FormData();
        }

        formData.append('url', this.vkAppUrl);

        let result = await fetch(this.actionServer + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });
        return result.json();
    }

    getInfo() {
        return this.post('get-info');
    }
    getTop() {
        return this.post('get-top');
    }

    getUser(vk_id) {
        const data = new FormData();
        data.append('vk_id', vk_id);

        return this.post('get-user',data);
    }

    

    getWordInfo(id) {
        const data = new FormData();
        data.append('id', id);

        return this.post('get-word-info', data);
    }

    like(wordId, isLike) {
        const data = new FormData();
        data.append('wordId', wordId);
        data.append('isLike', isLike);

        return this.post('like', data);
    }

    answer(wordId, answerId ) {
        const data = new FormData();
        data.append('wordId', wordId);
        data.append('answerId', answerId);
        return this.post('answer', data);
    }

    isNotify(isNotify) {
        const data = new FormData();
        data.append('isNotify',isNotify);
        return this.post('is-notify', data);
    }
}

