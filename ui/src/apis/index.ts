import shttp from '@/utils/shttp';
import type { IConfig, IGroup, IApp, IEngine } from '@/store';

async function getConfigs() {
  return await shttp.get<IConfig[]>('/api/config');
}

async function batchUpdateConfig(data: IConfig) {
  return shttp.put(`/api/config`, data);
}

async function updateConfig(name: string, value: string) {
  return await shttp.put(`/api/config/${name}`, { value });
}

async function getGroups() {
  return await shttp.get('/api/groups');
}

async function createGroup(data: Partial<IGroup>) {
  return await shttp.post('/api/groups', data);
}

async function updateGroup(id: string, data: Partial<IGroup>) {
  return await shttp.put(`/api/groups/${id}`, data);
}
async function updateGroups(data: Partial<IGroup>[]) {
  return await shttp.put(`/api/groups`, data);
}

async function deleteGroup(id: string) {
  return await shttp.delete(`/api/groups/${id}`);
}
async function getApps() {
  return await shttp.get<IApp[]>('api/apps');
}
async function createApp(data: Partial<IApp>) {
  return await shttp.post('/api/apps', data);
}

async function updateApp(id: string, data: Partial<IApp>) {
  return await shttp.put(`/api/apps/${id}`, data);
}

async function updateApps(data: Partial<IApp>[]) {
  return await shttp.put('/api/apps', data);
}

async function deleteApp(id: string) {
  return await shttp.delete(`/api/apps/${id}`);
}
async function getEngines() {
  return await shttp.get<IEngine[]>('/api/engines');
}
async function createEngine(data: Partial<IEngine>) {
  return await shttp.post('/api/engines', data);
}

async function updateEngine(id: string, data: Partial<IEngine>) {
  return await shttp.put(`/api/engines/${id}`, data);
}

async function deleteEngine(name: string) {
  return await shttp.delete(`/api/engines/${name}`);
}

async function getImages() {
  return await shttp.get('/api/images');
}
async function uploadImage(formdata: any) {
  return await shttp.post('/api/images', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
}
async function deleteImage(id: string) {
  return await shttp.delete(`/api/images/${id}`);
}
async function parseURL(domain: string) {
  return await shttp.post('/api/images/parse', { url: domain }, { headers: { 'Content-Type': 'application/json' } })
}
const apis = {
  getApps,
  createApp,
  updateApp,
  updateApps,
  deleteApp,
  getGroups,
  createGroup,
  updateGroup,
  updateGroups,
  deleteGroup,
  getEngines,
  createEngine,
  updateEngine,
  deleteEngine,
  getConfigs,
  updateConfig,
  batchUpdateConfig,
  getImages,
  uploadImage,
  deleteImage,
  parseURL,
}
export default apis;