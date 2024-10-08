import request from 'axios';

request.defaults.baseURL = process.env.PUBLIC_URL || '';

async function getConfigs() {
  return await request.get('/api/config');
}

async function batchUpdateConfig(data) {
  return request.put(`/api/config`, data);
}

async function updateConfig(name, value) {
  return await request.put(`/api/config/${name}`, { value });
}

async function getGroups() {
  return await request.get('/api/groups');
}

async function createGroup(data) {
  return await request.post('/api/groups', data);
}

async function updateGroup(id, data) {
  return await request.put(`/api/groups/${id}`, data);
}
async function updateGroups(data) {
  return await request.put(`/api/groups`, data);
}

async function deleteGroup(id) {
  return await request.delete(`/api/groups/${id}`);
}
async function getApps() {
  return await request.get('api/apps');
}
async function createApp(data) {
  return await request.post('/api/apps', data);
}

async function updateApp(id, data) {
  return await request.put(`/api/apps/${id}`, data);
}

async function updateApps(data) {
  return await request.put('/api/apps', data);
}

async function deleteApp(id) {
  return await request.delete(`/api/apps/${id}`);
}
async function getEngines() {
  return await request.get('/api/engines');
}
async function createEngine(data) {
  return await request.post('/api/engines', data);
}

async function updateEngine(id, data) {
  return await request.put(`/api/engines/${id}`, data);
}

async function deleteEngine(name) {
  return await request.delete(`/api/engines/${name}`);
}

async function getImages() {
  return await request.get('/api/images');
}
async function uploadImage(formdata) {
  return await request.post('/api/images', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
}
async function deleteImage(id) {
  return await request.delete(`/api/images/${id}`);
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
}
export default apis;