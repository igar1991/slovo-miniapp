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

    isNotify() {
        return this.post('is-notify');
    }
}

