import constants from 'utils/constants';
import SpotifyService from './SpotifyService';
import AppleMusicService from './AppleMusicService';

export default class StreamingFactory {
	constructor(type) {
		this.type = type;
	}

	createService() {
		if(this.type === 'spotify')
			return new SpotifyService();
		else if(this.type === 'apple_music')
			return new AppleMusicService();
	}
}
