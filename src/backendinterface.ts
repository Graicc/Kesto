import axios from 'axios';
import { baseUrl, ApiKey } from './config.json';

export const service = axios.create({
	baseURL: baseUrl,
	headers: {
		'Content-Type': 'application/json',
		'ApiKey': ApiKey,
	},
	// withCredentials: true, // send cookies when cross-domain requests
	// timeout: 5000 // request timeout
});

export function getIpBans() {
	return service.get('/admin/bans/ip')
		.catch(error => { console.log(error); });
}

export function addIpBan(ip: string) {
	return service.post('/admin/bans/ip', `"${ip}"`)
		.catch(error => { console.log(error); });
}

export function removeIpBan(ip: string) {
	return service.delete(`/admin/bans/ip/${ip}`)
		.catch(error => { console.log(error); });
}

export function getUserBans() {
	return service.get('/admin/bans/user')
		.catch(error => { console.log(error); });
}

export function addUserBan(user: string) {
	return service.post('/admin/bans/user', `"${user}"`)
		.catch(error => { console.log(error); });
}

export function removeUserBan(user: string) {
	return service.delete(`/admin/bans/user/${user}`)
		.catch(error => { console.log(error); });
}

export function addRunBan(run: number) {
	return service.post('/admin/bans/run', `${run}`)
		.catch(error => { console.log(error); });
}

export function removeRunBan(run: number) {
	return service.delete(`/admin/bans/run/${run}`)
		.catch(error => { console.log(error); });
}

export function getMaps() {
	return service.get('/admin/maps')
		.catch(error => { console.log(error); });
}

export function addMap(map: string) {
	return service.post('/admin/maps', `"${map}"`)
		.catch(error => { console.log(error); });
}

export function removeMap(map: string) {
	return service.delete(`/admin/maps/${map}`)
		.catch(error => { console.log(error); });
}