import constants from 'utils/constants';
import SpotifyService from './SpotifyService';
import AppleMusicService from './AppleMusicService';

// Factory design pattern
export default class StreamingFactory {
	constructor(type) {
		this.type = type;
	}

	// Create a new class based on type of factory
	createService() {
		if(this.type === 'spotify')
			return new SpotifyService();
		else if(this.type === 'apple_music')
			return new AppleMusicService();
	}
}
